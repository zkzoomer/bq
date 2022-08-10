import styled from "styled-components"
import { FaTrophy, FaExternalLinkAlt } from "react-icons/fa"
import { NavLink } from "react-router-dom"
import Jazzicon from "@metamask/jazzicon";

import { stylizeTokenId } from "../../pages/Solve/helpers"
import { truncateAddress } from "../../hooks/utils"
import { ZERO_ADDRESS } from "../../constants/values"
import { useEffect, useRef } from "react"

const CardWrapper = styled.div`
    position: relative;
    z-index: 1; 

    height: 330px;
    width:  250px;    
    border-radius: 20px;

    padding-top: 5px;
    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
    background-color: transparent;
    transition: all 0.2s ease-in-out;

    cursor: ${({isClickable}) => (isClickable ? `pointer` : `default`)};

    &:hover {
        box-shadow: ${({isClickable}) => (isClickable ? `0px 0px 0px 0px` : `2px 2px 2px 1px var(--main-text)`)};
        margin: ${({isClickable}) => (isClickable ? `2px 0px -2px 0px` : `0px 0px 0px 0px`)};
    }
`

const TesterIdWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    font-family: 'Inter Bold';
    font-size: 1.1rem;
    color: var(--alt-text);

    border-bottom: 1px solid var(--main-text);
`

const CredentialsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-style: italic;
    color: var(--main-text);

    padding: 5px;
    border-bottom: 1px solid var(--main-text);
`

const PrizeWrapper = styled.div`
    font-style: normal;
`

const SolversWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: 'Inter BoldItalic';
    color: var(--main-text);
`

const InlineBold = styled.span`
    font-family: 'Inter Bold';
    font-style: normal;
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

const InlineNavLink = styled(NavLink)`
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

const Trophy = styled(FaTrophy)`
    font-size: 1.2rem;
    color: var(--warning);
`

const ExternalLink = styled(FaExternalLinkAlt)`
    font-size: 1rem;
    
    &:hover {
        border-bottom: 1px solid var(--alt-text);
    }
`

const RequirementsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;   
    height: 50px;
    padding: 5px;
    border-bottom: 1px solid var(--main-text);
`

const CreatorWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;   
    height: 50px;
    padding: 5px;
    padding-bottom: 10px;
`

const StyledIdenticon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center; 
    padding-right: 5px;
`

// TODO: link to credential owners when it has been solved SOMEWHERE
export default function TesterCard ({ tokenStats, isClickable }) {

    function Identicon () {
        const ref = useRef();

        useEffect(() => {
            if (ref.current) {
                ref.current.innerHTML = "";
                ref.current.appendChild(Jazzicon(16, parseInt(tokenStats.owner.slice(2,10), 16)));
            }
        }, []);
    
        return <StyledIdenticon ref={ref} />
    }

    const handleClick = () => {
        window.location.href = '/solve/' + tokenStats.tokenId
    }

    return (
        <CardWrapper isClickable={isClickable} onClick={handleClick} >
            <TesterIdWrapper>
                TEST {stylizeTokenId(tokenStats.tokenId)}
            </TesterIdWrapper>
            <CredentialsWrapper>
                <InlineBold>
                    Credentials gained:
                </InlineBold>
                <br />
                {tokenStats.credentialsGained}
                <br /><br />
                {
                    tokenStats.prize > 0 && tokenStats.solvers === 0 ? 
                        <PrizeWrapper>
                            <InlineBold>Prize: </InlineBold>
                            {tokenStats.prize}
                            &nbsp;MATIC
                        </PrizeWrapper>
                    :
                        <SolversWrapper>
                            <Trophy />&nbsp;&nbsp;{tokenStats.solvers}
                        </SolversWrapper>
                }
            </CredentialsWrapper>
            <RequirementsWrapper>
                {
                    tokenStats.requiredPass !== ZERO_ADDRESS ? 
                        <>
                            <InlineBold>Required:&nbsp;</InlineBold>
                            <Link
                                href={'https://mumbai.polygonscan.com/token/' + tokenStats.requiredPass}
                                target='_blank' 
                            >
                                {truncateAddress(tokenStats.requiredPass)}
                                &nbsp;&nbsp;
                                <ExternalLink />
                            </Link>
                        </>
                    :
                        <InlineBold>No pass required</InlineBold>
                }
            </RequirementsWrapper>
            <CreatorWrapper>
                <InlineBold>Owner:&nbsp;&nbsp;</InlineBold>
                <InlineNavLink
                    to={'/profile/' + tokenStats.owner}
                >
                    <Identicon />
                    {truncateAddress(tokenStats.owner)}
                    &nbsp;&nbsp;
                </InlineNavLink>
            </CreatorWrapper>
        </CardWrapper>
    )
}