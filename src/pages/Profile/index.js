import styled from "styled-components"

const ProfileWrapper = styled.div`
    width: 100%;
    background-color: var(--main-background);
    height: 200vh;
`

// nothing else on url -> ask for connection, show connected account
// addy provided -> validate, if not valid 404; if vailid show content

export function Profile () {
    return (
        <ProfileWrapper>
            profile section
        </ProfileWrapper>
    )
}