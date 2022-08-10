import styled from "styled-components"
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from "react";

import { isValidAddress } from "../../hooks/utils";
import { ProfilePage } from "./ProfilePage";
import { theme } from "../../theme";

const NotFoundWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 80px;

    width: 100%;
    background-color: var(--main-background);
    min-height: calc(100vh - 120px);
`

const NotFoundText = styled.h1`
    color: var(--alt-text);
    font-size: 3rem;
    font-family: 'Inter Bold';
`

const NoProfileWrapper = styled.div`
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
const HeadText = styled.div`
    width: 100%;
    text-align: center;

    font-family: 'Inter Bold';
    font-size: 2rem;
    color: var(--alt-text);
    padding-bottom: 20px;
`

export function Profile () {
    const [address, setAddress] = useState(false);

    useEffect(() => {
        const _address = window.location.pathname.split('/profile/')[1]

        if (isValidAddress(_address)) {
            setAddress(_address)
        } else {
            setAddress(false)
        }
    }, [])

    if (address) {
        return(
            <ProfilePage address={address} />
        )
    } else { 
        return (
            <NotFoundWrapper>
                <NotFoundText>
                    404: Not Found
                </NotFoundText>
            </NotFoundWrapper>
        )
    }

}

export function AccountProfile () {

    const {
        account,
    } = useWeb3React();

    if (account) {
        return(
            <ProfilePage address={account} />
        )
    } else {    
        return (
            <NoProfileWrapper>
                <HeadText>
                    Connect your wallet to see your profile
                </HeadText>
            </NoProfileWrapper>
        )
    }
}