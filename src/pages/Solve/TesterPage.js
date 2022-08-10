import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components"
import { ethers } from "ethers"; 
import { Spinner } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

import { DEPLOYED_CONTRACTS } from "../../constants/chains";
import { stylizeTokenId, tokenUriToTest } from "./helpers";
import TesterCard from "../../components/TesterCard";
import SolveTester from "./SolveTester";
import { theme } from "../../theme";
import { DeleteButton } from "../../components/Button";
import { ZERO_ADDRESS } from "../../constants/values";

const SolveWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding-top: 50px;
    padding-bottom: 80px;

    width: 100%;
    background-color: var(--main-background);
    min-height: calc(100vh - 120px);

    @media (max-width: ${theme.breakpoint}px) {
        padding-top: 0px;
    }
`

const LoadingText = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    font-family: 'Inter Bold';
    font-size: 1.5rem;
    color: var(--alt-text);
`

const NotFoundText = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    font-family: 'Inter Bold';
    font-size: 1.5rem;
    color: var(--error);
`

const ErrorText = styled.div`
    text-align: justify;
    text-justify: inter-word;
    padding-top: 10px;

    font-family: 'Inter Bold';
    font-size: 1rem;
    color: var(--error); 
`

const TopRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 70%;
    padding-bottom: 75px;

    @media (max-width: ${theme.breakpoint}px) {
        width: 100%;
        flex-direction: column;
    }
`

const TitleAndDescriptionWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    text-align: start;
    order: 1;

    @media (max-width: ${theme.breakpoint}px) {
        order: 2;
    }
`

const TitleText = styled.div`
    width: 100%;
    font-family: 'Inter Bold';
    font-size: 1.5rem;
    color: var(--alt-text);
    text-align: justify;
    text-justify: inter-word;
    padding-bottom: 5px;
`

const DescriptionText = styled.div`
    width: 100%;
    font-family: 'Inter ExtraLightItalic';
    font-size: 1.2rem;
    color: var(--main-text);
    text-align: justify;
    text-justify: inter-word;
`

const CardWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: end;
    order: 2;

    @media (max-width: ${theme.breakpoint}px) {
        order: 1;
        justify-content: center;
        padding-top: 10px;
        padding-bottom: 50px;
    }
`

const emptyTokenStats = {
    _exists: null,
    _notSolvable: null,
    tokenId: "",
    owner: "_owner",
    solutionHash: "",
    prize: "",
    solvers: "",
    timeLimit: "",
    credentialLimit: "",
    requiredPass: ZERO_ADDRESS,
    credentialsGained: "",
    testerURI: "",
}

// TODO: must show connected account if they own the credential
export default function TesterPage ({ tokenId }) {
    const correctChain = useSelector(state => state.chain.correctChain);

    const [tokenStats, setTokenStats] = useState(emptyTokenStats);
    const [tester, setTester] = useState(null);
    const [deleteButtonState, setDeleteButtonState] = useState({
        active: false,
        enabled: false,
        awaiting: false
    })

    const {
        library,
        account,
        chainId,
    } = useWeb3React();

    const testerContract = new ethers.Contract(
        DEPLOYED_CONTRACTS[80001].TesterCreator,
        require('../../abis/TesterCreator.json')['abi'],
        new ethers.providers.JsonRpcProvider(process.env.REACT_APP_QUICKNODE_KEY)
    )

    useEffect(() => {
        const fetchTokenData = async () => {
            
            try {
                const _testerStats = await testerContract.getTester(tokenId)
                const _owner = await testerContract.ownerOf(tokenId)
                const testerURI = await testerContract.tokenURI(tokenId)

                let notSolvable = null
                if ( parseInt(_testerStats.solvers) === parseInt(_testerStats.credentialLimit)) {
                    notSolvable = "Test cannot be solved anymore: credential limit reached."
                } else if ( Math.floor(Date.now() / 1000) >= parseInt(_testerStats.timeLimit) ) {
                    notSolvable = "Test cannot be solved anymore: time limit reached."
                }

                const testerStats = {
                    _exists: true,
                    _notSolvable: notSolvable,
                    tokenId: '' + tokenId,
                    owner: _owner,
                    solutionHash: _testerStats.solutionHash.toString(),
                    prize: parseFloat(ethers.utils.formatEther(_testerStats.prize.toString())),
                    solvers: parseInt(_testerStats.solvers),
                    timeLimit: parseInt(_testerStats.timeLimit),
                    credentialLimit: parseInt(_testerStats.credentialLimit),
                    requiredPass: _testerStats.requiredPass,
                    credentialsGained: _testerStats.credentialsGained,
                    testerURI: testerURI,
                }
                setTokenStats(testerStats)
            } catch (err) {
                setTokenStats( prevState => ({
                    ...prevState,
                    _exists: false
                }))
            }
        }
        fetchTokenData()
    }, [])

    useEffect(() => {
        const fetchTester = async () => {
            let tester
            try {
                tester = await tokenUriToTest(tokenStats.testerURI)
                setTester(tester)
            } catch (err) {
                tester = false
                setTester(tester)
            }
        }
        if (tokenStats) {
            fetchTester()
        }
    }, [tokenStats.testerURI])

    useEffect(() => {
        setDeleteButtonState( prevState => ({
            ...prevState,
            active: account === tokenStats.owner,
            enabled: correctChain,
        }))
    }, [tokenStats, account, correctChain])

    // check if account owns the required pass 
    useEffect(() => {
        const fetchData = async () => { 
            const requiredPass = new ethers.Contract(
                tokenStats.requiredPass,
                require('../../abis/RequiredPass.json')['abi'],
                new ethers.providers.JsonRpcProvider(process.env.REACT_APP_QUICKNODE_KEY)
            ) 
            const userBalance = await requiredPass.balanceOf(account)
            
            if ( parseInt(userBalance) === 0 ) {

                setTokenStats( prevState => ({
                    ...prevState,
                    _notSolvable: "You cannot solve this test as you do not own the required pass"
                }))
            }
        }
        if ( tokenStats.requiredPass !== ZERO_ADDRESS && !!account) {
            fetchData()
        }
    }, [tokenStats.requiredPass, account])

    const TitleAndDescription = () => {

        const handleDeleteClick = async () => {
            setDeleteButtonState( prevState => ({
                ...prevState,
                awaiting: true
            }))

            const TesterCreatorABI = require('../../abis/TesterCreator.json')['abi']
            const testerCreator = new Contract(DEPLOYED_CONTRACTS[chainId].TesterCreator, TesterCreatorABI, library.getSigner())

            try {
                await testerCreator.deleteTester(
                    tokenStats.tokenId
                )
            } catch (err) {
                console.log(err)
            }

            setDeleteButtonState( prevState => ({
                ...prevState,
                awaiting: false
            }))
        }
        
        if ( tester === null ) {
            return(
                <TitleAndDescriptionWrapper>
                    <LoadingText>
                        Loading test...&nbsp;&nbsp;<Spinner animation="border" size="m" />
                    </LoadingText>
                </TitleAndDescriptionWrapper>
            )
        } else if ( tester === false ) {
            return(
                <TitleAndDescriptionWrapper>
                    <NotFoundText>
                        Test format is not supported
                    </NotFoundText>
                    You can try and check the token URI directly: 
                    <br />
                    {tokenStats.testerURI}
                    {
                        deleteButtonState.active ? 
                            <DeleteButton 
                                disabled={deleteButtonState.awaiting}
                                isEnabled={deleteButtonState.enabled}
                                onClick={handleDeleteClick}
                            >
                                {
                                    deleteButtonState.awaiting ?
                                        <>
                                            Sending tx...&nbsp;&nbsp;<Spinner animation="border" size="sm" />
                                        </>
                                    :
                                        <>
                                            <FaTrashAlt />&nbsp;&nbsp;Delete Test
                                        </>
                                } 
                            </DeleteButton>
                        :
                            null
                    }
                    <ErrorText>
                        {tokenStats._notSolvable}
                    </ErrorText>
                </TitleAndDescriptionWrapper>
            )
        } else {
            return(
                <TitleAndDescriptionWrapper>
                    <TitleText>
                        {tester.title}
                    </TitleText>
                    <DescriptionText>
                        {tester.description}
                    </DescriptionText>
                    {
                        deleteButtonState.active ? 
                            <DeleteButton 
                                disabled={deleteButtonState.awaiting}
                                isEnabled={deleteButtonState.enabled}
                                onClick={handleDeleteClick}
                            >
                                {
                                    deleteButtonState.awaiting ?
                                        <>
                                            Sending tx...&nbsp;&nbsp;<Spinner animation="border" size="sm" />
                                        </>
                                    :
                                        <>
                                            <FaTrashAlt />&nbsp;&nbsp;Delete Test
                                        </>
                                } 
                            </DeleteButton>
                        :
                            null
                    }
                    <ErrorText>
                        {tokenStats._notSolvable}
                    </ErrorText>
                </TitleAndDescriptionWrapper>
            )
        }
        
    }

    if ( tokenStats._exists === null ) {
        return (
            <SolveWrapper>
                <LoadingText>
                    Loading token...&nbsp;&nbsp;<Spinner animation="border" size="m" />
                </LoadingText>
            </SolveWrapper>
        )
    } else if ( tokenStats._exists === false ) {
        return(
            <SolveWrapper>
                <NotFoundText>
                    Token {stylizeTokenId(tokenId)} does not exist
                </NotFoundText>
            </SolveWrapper>
        )
    } else {
        return(
            <SolveWrapper>
                <TopRow>
                    <TitleAndDescription />
                    <CardWrapper>
                        <TesterCard tokenStats={tokenStats}/>
                    </CardWrapper>
                </TopRow>
                {
                    tester ?
                        <SolveTester tokenStats={tokenStats} tester={tester} />
                    :
                        null
                }
            </SolveWrapper>
        )
    }   
}