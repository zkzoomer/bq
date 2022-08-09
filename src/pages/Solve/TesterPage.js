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
    }
`

const emptyTokenStats = {
    _exists: null,
    tokenId: "",
    owner: "_owner",
    solutionHash: "",
    prize: "",
    solvers: "",
    timeLimit: "",
    credentialLimit: "",
    requiredPass: "",
    credentialsGained: "",
    testerURI: "",
}

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

    useEffect(() => {
        const fetchTokenData = async () => {
            const testerContract = new ethers.Contract(
                DEPLOYED_CONTRACTS[80001].TesterCreator,
                require('../../abis/TesterCreator.json')['abi'],
                new ethers.providers.JsonRpcProvider(process.env.REACT_APP_QUICKNODE_KEY)
            )
            
            try {
                const _testerStats = await testerContract.getTester(tokenId)
                const _owner = await testerContract.ownerOf(tokenId)
                const testerURI = await testerContract.tokenURI(tokenId)
                const testerStats = {
                    _exists: true,
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
            } catch (err) {
                tester = false
            }
            setTester(tester)
        }
        if (tokenStats) {
            fetchTester()
        }
    }, [tokenStats])

    useEffect(() => {
        setDeleteButtonState( prevState => ({
            ...prevState,
            active: account === tokenStats.owner,
            enabled: correctChain,
        }))
    }, [tokenStats, account, correctChain])


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
                    You can try and check the token URI directly: {tokenStats.testerURI}
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