import { useState } from "react"
import { NavLink } from "react-router-dom"
import styled from "styled-components"
import { FaPlus, FaMapPin } from 'react-icons/fa'
import { CopyIcon } from '@chakra-ui/icons'
import { PinAngle } from '@styled-icons/bootstrap/PinAngle'

import { AddElementButton, UploadButton } from "../../components/Button"
import Question from "./Question"
import { MAX_QUESTIONS, MAX_ANSWERS } from "../../constants/values"
import { theme } from "../../theme"
import { getNumberOfQuestions, getSolutionHash, generateMarkdownFile, getNumberOfAnswers, getNullAnswersDict, getNullAnswersFirstEmptyDict, shiftKeysInAnswersDict } from "./helpers"

const PublishWrapper = styled.div`
    width:  100%;
    min-height: 58vh;
`

const SectionTitle = styled.div`
    font-size: 1.7rem;
    color: var(--alt-text);
    padding-top: 30px;
    padding-bottom: 10px;
`

const SectionSubTitle = styled.div`
    font-size: 1.2rem;
    font-family: 'Inter ExtraLight';
    color: var(--main-text);
    padding-bottom: 30px;
`

const InlineLink = styled.a`
    font-weight: 600;

    &:hover {
        color: var(--alt-text);
    }
`

const InlineNavLink = styled(NavLink)`
    font-family: 'Inter ExtraLight';
    text-decoration: none;
    cursor: pointer;
    color: var(--alt-text);
`

const InlineButton = styled.button`
    font-family: 'Inter ExtraLight';
    cursor: pointer;
    color: var(--alt-text);
`

const QuestionsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const ButtonsWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 50px;

    @media (max-width: ${theme.breakpoint}px) {
        flex-direction: column;
    }
`

const Pin = styled(PinAngle)`
    height: 55%;
`


export default function PublishQuestions ({ test, setTest, correctAnswers, setCorrectAnswers, setSubmission, advanceSection }) {

    const addQuestion = () => {
        let len = getNumberOfQuestions(test)
        let newKey = 'Q' + (len + 1)
        setTest( prevState => ({
            ...prevState,
            [newKey]: { Q: "", A: getNullAnswersFirstEmptyDict(newKey) }
        }))
    }

    const removeQuestion = (keyToRemove) => {
        setTest( prevState => {
            const _state = {...prevState}
            const toRemove = parseInt(keyToRemove.substring(1))
            for (var i = toRemove; i < MAX_QUESTIONS; i++) {
                _state['Q' + i] = {
                    Q: _state['Q' + (i + 1)].Q,
                    A: shiftKeysInAnswersDict('Q' + (i + 1), _state['Q' + (i + 1)].A, 'Q' + i)
                }
            }
            _state['Q' + MAX_QUESTIONS] = { Q: null, A: getNullAnswersDict('Q' + MAX_QUESTIONS) }
            return _state
        })
    }

    const addAnswer = (questionKey) => {
        let len = getNumberOfAnswers(test[questionKey].A)
        let newKey = questionKey + 'A' + (len + 1)
        setTest( prevState => {
            const _state = {...prevState}
            _state[questionKey].A[newKey] = ""
            return _state
        })
    }

    // TODO: fix and change the correctAnswer w
    const removeAnswer = (questionKey, keyToRemove) => {
        // shifting answer boxes
        const toRemove = parseInt(keyToRemove.split('A')[1])
        setTest( prevState => {
            const _answers = {...prevState[questionKey].A}
            for (var i = toRemove; i < MAX_ANSWERS; i++) {
                _answers[questionKey + 'A' + i] = _answers[questionKey + 'A' + (i + 1)]
            }
            _answers[questionKey + 'A' + MAX_ANSWERS] = null
            return { 
                ...prevState,
                [questionKey]: {
                    ...prevState[questionKey],
                    A: _answers
                }
            }
        })
        // changing correct answer as well
        const questionIndex = parseInt(questionKey.substring(1)) - 1
        setCorrectAnswers( prevState => {
            const _answer = prevState[questionIndex]
            let answer
            if ( _answer === null || toRemove === answer) {
                answer = null
            } else if (toRemove > _answer) {
                answer = _answer
            } else if (toRemove < _answer) {
                answer = _answer - 1
            }
            return [
                ...prevState.slice(0, questionIndex),
                answer,
                ...prevState.slice(questionIndex + 1),
            ]
        })
    }

    const setQuestionText = (key, _questionText) => {
        setTest( prevState => {
            const _state = {...prevState}
            _state[key].Q = _questionText
            return _state
        })
    }

    const setAnswerText = (key, answerKey, _answerText) => {
        setTest( prevState => {
            const _state = {...prevState}
            _state[key].A[answerKey] = _answerText
            return _state
        })
    }

    const setCorrectAnswer = (questionKey, answer) => {
        const questionIndex = parseInt(questionKey.substring(1)) - 1
        setCorrectAnswers( prevState => {
            return [
                ...prevState.slice(0, questionIndex),
                answer,
                ...prevState.slice(questionIndex + 1),
            ]
        })
    }

    const handleCopyClick = () => {
        const hash = getSolutionHash(correctAnswers)
        navigator.clipboard.writeText(hash.toString())
    }

    const questionBoxes = Object.entries(test).map(( [key, value] ) => {
        return(
            value.Q === null ?
                null
            :
                <Question 
                    id={key}
                    key={key}
                    testQuestion={test[key]}
                    setQuestionText={(questionText) => setQuestionText(key, questionText)}
                    addAnswer={() => addAnswer(key)}
                    removeAnswer={(keyToRemove) => removeAnswer(key, keyToRemove)}
                    correctAnswer={correctAnswers[parseInt(key.substring(1)) - 1]}
                    setCorrectAnswer={(answer) => setCorrectAnswer(key, answer)}
                    setAnswerText={(answerKey, answerText) => setAnswerText(key, answerKey, answerText)}
                    isRemovable={test.Q2.Q !== null}
                    removeQuestion={() => { removeQuestion(key) }}
                    hasError={false}
                />
        )
    })

    return(
        <PublishWrapper key='publishWrapper'>
            <SectionTitle>
                Step 1: Create your multiple choice test in
                <InlineLink  href='https://www.markdownguide.org/basic-syntax/' target='_blank' aria_label='Markdown guide'> markdown </InlineLink>
                and publish it to IPFS
            </SectionTitle>
            <SectionSubTitle>
                If you already uploaded your
                <InlineNavLink to="/help"> supported markdown file, </InlineNavLink>
                you can <InlineButton onClick={advanceSection}>skip this step.</InlineButton>
            </SectionSubTitle>
            <QuestionsWrapper key='questionsWrapper'>
                {questionBoxes}
                {
                    getNumberOfQuestions(test) === MAX_QUESTIONS ? 
                        null
                    :
                        <AddElementButton onClick={addQuestion}><FaPlus />&nbsp;&nbsp;Add Question</AddElementButton>
                }
            </QuestionsWrapper>
            <ButtonsWrapper>
                <UploadButton key='hash' disabled={!correctAnswers.length} isEnabled={!!correctAnswers.length} onClick={handleCopyClick}>
                    <CopyIcon />&nbsp;&nbsp;Copy solution hash
                </UploadButton>
                <UploadButton key='ipfs' isEnabled={true}>
                    <Pin />&nbsp;&nbsp;Pin to IPFS
                </UploadButton>
            </ButtonsWrapper>
            {/* 
            question wrapper as many as defined - inside it 
                toggle preview (global)
                remove question
                default inputbox for the question text
                one default inputbox for as many answer text as defined
                add answer (+) button up to the max supported
            add question button (+) up to the max supported
            very bottom: two buttons:
                - copy solution hash
                - pin to IPFS // when pinned: copy IPFS link
             */}
        </PublishWrapper>
    )
}