import styled from "styled-components"

import { theme } from "../../theme"

const ProfileWrapper = styled.div`
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

export function ProfilePage ({ address }) {

    return(
        <ProfileWrapper>
            a profile page for:
            <br />
            {address}
        </ProfileWrapper>
    )
}