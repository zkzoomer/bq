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
    padding-top: 50px;
    padding-bottom: 80px;

    width: 70%;
    background-color: var(--main-background);
    min-height: calc(100vh - 120px);

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

export function Browse () {
    const [cards, setCards] = useState({
        totalSupply: 0,
        loadedCards: 0,
        cardsToLoad: 0,
        testerCards: []
    })

    const testerContract = new ethers.Contract(
        DEPLOYED_CONTRACTS[80001].TesterCreator,
        require('../../abis/TesterCreator.json')['abi'],
        new ethers.providers.JsonRpcProvider(process.env.REACT_APP_QUICKNODE_KEY)
    )

    // first page load, get the total supply, and load the first one
    useEffect(() => {
        const fetchData = async () => {
            const totalSupply = parseInt(await testerContract.totalSupply())
            const firstTokenId = parseInt(await testerContract.tokenByIndex(0))
            const firstCard = await loadCard(firstTokenId)

            setCards({
                totalSupply,
                loadedCards: 1,
                cardsToLoad: totalSupply > 8 ? 8 : totalSupply,
                testerCards: [firstCard]
            })
        }
        fetchData()
    }, [])

    window.onscroll = function (e) {
		if (
			(window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50  // Footer is 40 px high
			&&
			cards.loadedCards === cards.cardsToLoad
            &&
            cards.loadedCards !== cards.totalSupply  // stop loading when all been loaded
		) {
			setCards(prevState => ({       
                ...prevState,
                cardsToLoad: cards.totalSupply > prevState.cardsToLoad + 4 ? prevState.cardsToLoad + 4 : cards.totalSupply
            }))
		}
	}; 

    // add cards one by one for all the load cards prompted
    useEffect(() => {
        const addCard = async () => {
            const tokenId = parseInt(await testerContract.tokenByIndex( cards.loadedCards ))
            const newCard = await loadCard(tokenId)

            setCards(prevState => ({       
                ...prevState,
                loadedCards: prevState.loadedCards + 1,
                testerCards: [...prevState.testerCards, newCard]
            }))
        }
        if (cards.loadedCards < cards.cardsToLoad) {
            addCard()
        }
    }, [cards.testerCards, cards.cardsToLoad])

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

    // TODO: solve clickable div inside clickable div issue
    return (
        <BrowseWrapper>
            <HeadText>
                Browsing all credentials
            </HeadText>
            <CardGallery>
                {
                    cards.loadedCards === 0 ? 
                        <LoadingText>
                            Loading tokens...&nbsp;&nbsp;<Spinner animation="border" size="m" />
                        </LoadingText>
                    : 
                        [...Array(cards.cardsToLoad).keys()].map((index) => {
                            if (cards.loadedCards > index) {
                                return(
                                    <CardWrapper key={index}>
                                        {cards.testerCards[index]}
                                    </CardWrapper>
                                )
                            } else {
                                return(
                                    <LoadingCard key={index}/>
                                )
                            }
                        })
                }
            </CardGallery>
        </BrowseWrapper>
    )
}