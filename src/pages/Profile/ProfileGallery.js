import { useEffect, useState } from "react"
import { ethers } from "ethers"; 
import styled from "styled-components"
import Spinner from 'react-bootstrap/Spinner';

import { DEPLOYED_CONTRACTS } from "../../constants/chains"
import { theme } from "../../theme"
import TesterCard from "../../components/TesterCard";

const BrowseWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding-bottom: 80px;

    width: 100%;
    background-color: var(--main-background);

    @media (max-width: ${theme.breakpoint}px) {
        width: 100%;
        flex-direction: column;
    }
`

const HeadText = styled.div`
    width: 100%;
    text-align: left;

    font-family: 'Inter Bold';
    font-size: 2rem;
    color: var(--alt-text);
    padding-top: 20px;
    padding-bottom: 20px;

    @media (max-width: ${theme.breakpoint}px) {
        text-align: center;
    }
`

const CardGallery = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: start;
    justify-content: space-between;

    @media (max-width: ${theme.breakpoint}px) {
        justify-content: center;
    }
`

const CardWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 20px;
`

const LoadingCardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 330px;
    width:  250px;    
    border-radius: 20px;

    font-family: 'Inter Bold';
    font-size: 1.3rem;
    color: var(--alt-text);

    padding-top: 5px;
    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
    background-color: transparent;
    transition: all 0.2s ease-in-out;
`

const LoadingCardText = styled.div`
    font-family: 'Inter Bold';
    font-size: 1.3rem;
    padding-bottom: 15px;
`

const LoadingText = styled.div`
    padding-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    font-family: 'Inter Bold';
    font-size: 1.5rem;
    color: var(--alt-text);
`

const EmptyText = styled.div`
    padding-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    font-family: 'Inter ExtraLightItalic';
    font-size: 1.2rem;
    color: var(--main-text);
`

const LoadingCard = () => {
    return(
        <CardWrapper>
            <LoadingCardWrapper>
                <LoadingCardText>
                    Loading token...
                </LoadingCardText>
                <Spinner animation="border" size="m" />
            </LoadingCardWrapper>
        </CardWrapper>
    )
}

export default function ProfileGallery ({ address, page, cards, setCards }) {

    const testerContract = new ethers.Contract(
        DEPLOYED_CONTRACTS[80001].TesterCreator,
        require('../../abis/TesterCreator.json')['abi'],
        new ethers.providers.JsonRpcProvider(process.env.REACT_APP_QUICKNODE_KEY)
    )
    const credenitalsContract = new ethers.Contract(
        DEPLOYED_CONTRACTS[80001].Credentials,
        require('../../abis/Credentials.json')['abi'],
        new ethers.providers.JsonRpcProvider(process.env.REACT_APP_QUICKNODE_KEY)
    )

    const getContract = () => {
        if (page === 'gained') {  // returning the credentials contract
            return credenitalsContract
        } else if (page === 'owned') {  // returning the testing contract
            return testerContract
        }
    }

    // first page load, if no cards have been loaded, load first one and set the ones to load
    useEffect(() => {
        const fetchData = async () => {
            const firstTokenId = parseInt(await getContract().tokenOfOwnerByIndex(address, 0))
            const firstCard = await loadCard(firstTokenId)

            setCards(prevState => ({
                ...prevState,
                [page]:  {
                    ...prevState[page],
                    loadedCards: 1,
                    cardsToLoad: prevState[page].totalSupply > 8 ? 8 : prevState[page].totalSupply,
                    testerCards: [firstCard]
                }
            }))
        }
        if (cards[page].loadedCards === 0 && cards[page].totalSupply !== null && cards[page].totalSupply > 0) {
            fetchData()
        }
    }, [cards[page].totalSupply])

    window.onscroll = function (e) {
		if (
			(window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50  // Footer is 40 px high
			&&
			cards[page].loadedCards === cards[page].cardsToLoad
            &&
            cards[page].loadedCards !== cards[page].totalSupply  // stop loading when all been loaded
		) {
            setCards(prevState => ({
                ...prevState,
                [page]:  {
                    ...prevState[page],
                    cardsToLoad: prevState[page].totalSupply > prevState[page].cardsToLoad + 4 ? prevState[page].cardsToLoad + 4 : prevState[page].totalSupply
                }
            }))
		}
	}; 

    // add cards one by one for all the load cards prompted
    useEffect(() => {
        const addCard = async () => {
            const tokenId = parseInt(await testerContract.tokenOfOwnerByIndex( address, cards[page].loadedCards ))
            const newCard = await loadCard(tokenId)

            setCards(prevState => ({
                ...prevState,
                [page]: {
                    ...prevState[page],
                    loadedCards: prevState[page].loadedCards + 1,
                    testerCards: [...prevState[page].testerCards, newCard]
                }
            }))
        }
        if (cards[page].loadedCards < cards[page].cardsToLoad) {
            addCard()
        }
    }, [cards[page].testerCards, cards[page].cardsToLoad])

    const loadCard = async (tokenId) => {
        const _tokenStats = await testerContract.getTester(tokenId)
        const _owner = await testerContract.ownerOf(tokenId)
        const tokenStats = {
            tokenId: '' + tokenId,
            owner: _owner,
            prize: parseFloat(ethers.utils.formatEther(_tokenStats.prize.toString())),
            solvers: parseInt(_tokenStats.solvers),
            requiredPass: _tokenStats.requiredPass,
            credentialsGained: _tokenStats.credentialsGained,
        }

        return(
            <TesterCard
                tokenStats={tokenStats}
                isClickable={true}
            />
        )
    }

    const Gallery = () => {
        if (cards[page].totalSupply === null) {
            return(
                <LoadingText>
                    Loading tokens...&nbsp;&nbsp;<Spinner animation="border" size="m" />
                </LoadingText>
            )
        } else if (cards[page].totalSupply === 0) {
            return(
                <EmptyText>
                    {
                        page === 'gained' ? 
                        'This account does not have any credentials'
                    :
                        'This account does not own any credentials'
                    }
                </EmptyText>
            )
        } else {
            if (cards[page].loadedCards === 0) {
                return(
                    <LoadingText>
                        Loading tokens...&nbsp;&nbsp;<Spinner animation="border" size="m" />
                    </LoadingText>
                )
            } else {
                return(
                    [...Array(cards[page].cardsToLoad).keys()].map((index) => {
                        if (cards[page].loadedCards > index) {
                            return(
                                <CardWrapper key={index}>
                                    {cards[page].testerCards[index]}
                                </CardWrapper>
                            )
                        } else {
                            return(
                                <LoadingCard key={index}/>
                            )
                        }
                    })
                )
            }
        }
    }

    return(
        <BrowseWrapper>
            <HeadText>
                {
                    page === 'gained' ? 
                        'Browsing all gained credentials'
                    :
                        'Browsing all owned credentials'
                }
            </HeadText>
            <CardGallery>
                <Gallery />
            </CardGallery>
        </BrowseWrapper>
    )
}
