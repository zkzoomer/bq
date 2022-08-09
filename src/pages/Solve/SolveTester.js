import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useWeb3React } from '@web3-react/core';
import { Contract } from "@ethersproject/contracts";
import styled from "styled-components"
import { SolveButton } from "../../components/Button";
import { FaPencilAlt } from "react-icons/fa"
import Spinner from 'react-bootstrap/Spinner';

import { MAX_QUESTIONS } from "../../constants/values";
import Question from "./Question";
import { DEPLOYED_CONTRACTS } from "../../constants/chains";
import { setModal } from '../../state/modal/reducer';
import { setError } from '../../state/error/reducer';
import { getNumberOfQuestions } from "./helpers";

import { _groth16FullProve } from "../../proof/snarkjs";

const QuestionsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding-top: 50px;
`

const zeroAnswers = []
const noQuestionErrors = []
for (var i = 1; i <= MAX_QUESTIONS; i++) {
    noQuestionErrors.push(false)
    zeroAnswers.push(1)
}

export default function SolveTester ({ tokenStats, tester }) {
    const correctChain = useSelector(state => state.chain.correctChain);
    const dispatch = useDispatch()

    const [answers, setAnswers] = useState(zeroAnswers)
    const [errors, setErrors] = useState(noQuestionErrors);
    const [buttonState, setButtonState] = useState({
        enabled: false,
        awaiting: false
    })

    const {
        library,
        account,
        chainId,
    } = useWeb3React();

    const verifyAnswersWasm = require("../../proof/verify_answers.wasm");
    const verifyAnswersZkey = require("../../proof/verify_answers_final.zkey");

    useEffect(() => {
        // must be on the correct chain, and account cannot be owner
        setButtonState( prevState => ({
            ...prevState,
            enabled: correctChain && account !== tokenStats.owner && !tokenStats._notSolvable
        }))
    }, [correctChain, account, tokenStats])


    const handleClick = async () => {
        setButtonState( prevState => ({
            ...prevState,
            awaiting: true
        }))

        let allQuestionsAnswered = true;
        const _errors = [...noQuestionErrors];
        const nQuestions = getNumberOfQuestions(tester)
        for ( var i = 0; i < nQuestions; i++) {
            if (answers[i] === 0) {
                allQuestionsAnswered = false
                _errors[i] = true
            }
        }
        if ( !allQuestionsAnswered ) {
            setErrors( _errors )
            dispatch(setError(['Some questions are not answered', 'Make sure you answer all questions before submitting your solution']))
            dispatch(setModal('error'))
            setButtonState( prevState => ({
                ...prevState,
                awaiting: false
            }))
            return
        }

        // all answers set, make proof
        const { proof, publicSignals } = await _groth16FullProve(
            {
                "answers": answers,
                "salt": Math.floor(Math.random() * 1_000_000_000_000_000).toString()
            },
            verifyAnswersWasm,
            verifyAnswersZkey
        )

        console.log(proof)
        console.log(publicSignals)

        const TesterCreatorABI = require('../../abis/TesterCreator.json')['abi']
        const testerCreator = new Contract(DEPLOYED_CONTRACTS[chainId].TesterCreator, TesterCreatorABI, library.getSigner())

        setButtonState( prevState => ({
            ...prevState,
            awaiting: false
        }))
    }

    const setAnswer = (questionKey, answer) => {
        const questionIndex = parseInt(questionKey.substring(1)) - 1
        setAnswers( prevState => {
            return [
                ...prevState.slice(0, questionIndex),
                answer,
                ...prevState.slice(questionIndex + 1),
            ]
        })
    }

    const questionBoxes = Object.entries(tester).map(( [key, value] ) => {
        if (key === 'title' || key === 'description') {
            return null
        }
        return(
            <Question 
                id={key}
                key={key}
                testQuestion={tester[key]}
                answer={answers[parseInt(key.substring(1)) - 1]}
                setAnswer={(answer) => setAnswer(key, answer)}
                hasError={errors[parseInt(key.substring(1)) - 1]}
            />
        )
    })

    if ( !tester ) { return( null ) }
    else {
        return(
            <> 
                <QuestionsWrapper>
                    {questionBoxes}
                </QuestionsWrapper>
                <ButtonWrapper>
                    <SolveButton 
                        disabled={!buttonState.enabled || buttonState.awaiting} 
                        isEnabled={buttonState.enabled} 
                        onClick={handleClick}
                    >
                        {
                            buttonState.awaiting ? 
                                <>
                                    Sending tx...&nbsp;&nbsp;<Spinner animation="border" size="sm" />
                                </>
                            :
                                <>
                                    <FaPencilAlt />&nbsp;&nbsp;Submit Solution
                                </>
                        }
                    </SolveButton>
                </ButtonWrapper>
            </>
        )
    }
}