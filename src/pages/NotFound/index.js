import styled from "styled-components"

const NotFoundWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 80px;

    width: 100%;
    background-color: var(--main-background);
    height: calc(100vh - 120px);
`

const NotFoundText = styled.h1`
    color: var(--alt-text);
    font-size: 3rem;
    font-family: 'Inter Bold';
`

export function NotFound () {
    return (
        <NotFoundWrapper>
            <NotFoundText>
                404: Not Found
            </NotFoundText>
        </NotFoundWrapper>
    )
}