import styled from "styled-components"

const ProfileWrapper = styled.div`
    width: 100%;
    background-color: var(--main-background);
    height: 200vh;
`

export function Profile () {
    return (
        <ProfileWrapper>
            profile section
        </ProfileWrapper>
    )
}