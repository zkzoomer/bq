import { useEffect, useState, useRef } from "react"
import { ethers } from "ethers"; 
import styled from "styled-components"
import { FaTrophy, FaPencilAlt, FaExternalLinkAlt } from "react-icons/fa"
import Jazzicon from "@metamask/jazzicon";
import Spinner from 'react-bootstrap/Spinner';

import ProfileGallery from './ProfileGallery'
import { DEPLOYED_CONTRACTS } from "../../constants/chains"
import { GainedButton, OwnedButton } from "../../components/Button"
import { theme } from "../../theme"
import { truncateAddress } from "../../hooks/utils"

const ProfilePageWrapper = styled.div`
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
    }
`

const AccountWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    height: 50px;
    width:  100%;    
    border-radius: 5px;

    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
    background-color: transparent;
`

const AddressWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;

    font-size: 1.2rem;
    padding-left: 20px;
`

const InlineBold = styled.span`
    font-family: 'Inter Bold';
    font-style: normal;

    @media (max-width: ${theme.breakpoint}px) {
        display: none;
    }
`

const Link = styled.a`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;  
    cursor: pointer;

    &:hover {
        color: var(--alt-text);
        text-decoration: underline;
    }

    position: relative;
    z-index: 2; 
`

const ExternalLink = styled(FaExternalLinkAlt)`
    font-size: 1rem;
`

const StyledIdenticon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 5px; 
    padding-right: 5px;
`

const StatsWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: end;

    font-size: 1.2rem;
    padding-right: 20px;
`

const LoadingText = styled.div`
    text-align: right;
    font-size: 1.2rem;
    color: var(--alt-text);
`

const StatsText = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;

    font-family: 'Inter BoldItalic';
    text-align: right;
    font-size: 1.2rem;
    color: var(--main-text);
`

const Trophy = styled(FaTrophy)`
    width: 100%;
    color: var(--warning);
    padding-left: 10px;
    padding-right: 5px;
`

const Pencil = styled(FaPencilAlt)`
    width: 100%;
    color: var(--alt-text);
    padding-left: 10px;
    padding-right: 5px;
`

const ButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    padding-top: 20px;
    padding-bottom: 20px;

    @media (max-width: ${theme.breakpoint}px) {
        justify-content: center;
    }
`

export function ProfilePage ({ address }) {
    const [page, setPage] = useState('gained')
    const [stats, setStats] = useState({ gained: null, owned: null })
    const [cards, setCards] = useState({
        gained: {
            totalSupply: null,
            loadedCards: 0,
            cardsToLoad: 0,
            testerCards: []
        }, 
        owned: {
            totalSupply: null,
            loadedCards: 0,
            cardsToLoad: 0,
            testerCards: []
        }
    })

    const testerContract = new ethers.Contract(
        DEPLOYED_CONTRACTS[80001].TesterCreator,
        require('../../abis/TesterCreator.json')['abi'],
        new ethers.providers.JsonRpcProvider(process.env.REACT_APP_QUICKNODE_KEY)
    )

    const credentialsContract = new ethers.Contract(
        DEPLOYED_CONTRACTS[80001].Credentials,
        require('../../abis/Credentials.json')['abi'],
        new ethers.providers.JsonRpcProvider(process.env.REACT_APP_QUICKNODE_KEY)
    )

    useEffect(() => {
        const fetchData = async () => {
            const gained = parseInt(await credentialsContract.balanceOf(address))
            const owned = parseInt(await testerContract.balanceOf(address))
    
            setStats({
                gained,
                owned,
            })

            setCards( prevState => ({
                gained: {
                    ...prevState.gained,
                    totalSupply: gained
                },
                owned: {
                    ...prevState.owned,
                    totalSupply: owned
                }
            }))
        }
        fetchData()
    }, [])

    function Identicon () {
        const ref = useRef();

        useEffect(() => {
            if (ref.current) {
                ref.current.innerHTML = "";
                ref.current.appendChild(Jazzicon(16, parseInt(address.slice(2,10), 16)));
            }
        }, []);
    
        return <StyledIdenticon ref={ref} />
    }

    return(
        <ProfilePageWrapper>
            <AccountWrapper>
                <AddressWrapper>
                    <InlineBold>Address:&nbsp;</InlineBold>
                    <Link
                        href={'https://mumbai.polygonscan.com/address/' + address}
                        target='_blank' 
                    >
                        <Identicon />
                        {truncateAddress(address)}
                        &nbsp;&nbsp;
                        <ExternalLink />
                    </Link>
                </AddressWrapper>
                <StatsWrapper>
                    {
                        stats.owned === null ? 
                            <LoadingText>
                                Loading...&nbsp;&nbsp;
                                <Spinner animation="border" size="sm" />
                            </LoadingText>
                        :
                            <StatsText>
                                <Trophy />
                                {stats.gained}
                                <Pencil />
                                {stats.owned}
                            </StatsText>
                    }
                </StatsWrapper>
            </AccountWrapper>
            <ButtonWrapper>
                <GainedButton active={page==='gained'} disabled={page==='gained'} onClick={() => setPage('gained')} >
                    Gained
                </GainedButton>
                <OwnedButton active={page==='owned'} disabled={page==='owned'} onClick={() => setPage('owned')}>
                    Owned
                </OwnedButton>
            </ButtonWrapper>
            <ProfileGallery
                address={address}
                page={page}
                cards={cards}
                setCards={setCards}
            />
        </ProfilePageWrapper>
    )
}