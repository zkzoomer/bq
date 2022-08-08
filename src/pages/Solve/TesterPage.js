import { useEffect, useState } from "react";
import styled from "styled-components"
import { ethers } from "ethers"; 

import { DEPLOYED_CONTRACTS } from "../../constants/chains";
import { stylizeTokenId, tokenUriToTest } from "./helpers";
import TesterCard from "../../components/TesterCard";
import SolveTester from "./SolveTester";
import { theme } from "../../theme";
import { Spinner } from "react-bootstrap";

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
    align-items: center;
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

export default function TesterPage ({ tokenId }) {
    const [tokenStats, setTokenStats] = useState(null);
    const [tester, setTester] = useState(null);

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
                setTokenStats(false)
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

    const TitleAndDescription = () => {

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
                </TitleAndDescriptionWrapper>
            )
        }
        
    }

    if ( tokenStats === null ) {
        return (
            <SolveWrapper>
                <LoadingText>
                    Loading token...&nbsp;&nbsp;<Spinner animation="border" size="m" />
                </LoadingText>
            </SolveWrapper>
        )
    } else if ( tokenStats === false ) {
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