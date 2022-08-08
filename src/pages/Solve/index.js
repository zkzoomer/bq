import { useEffect, useState } from "react"
import styled from "styled-components"
import TesterPage from "./TesterPage"

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

export function Solve () {
    const [isToken, setIsToken] = useState(false) // useState to see if it is token or not, and get the tester struct

    useEffect(() => {
        const path = window.location.pathname.split('/solve/')[1]
        const _isToken = Number.isInteger(parseFloat(path)) && parseInt(path) > 0
        if (_isToken) {
            setIsToken(parseInt(path))
        }
    }, [])

    return (
        <>
            {
                isToken ? 
                    <TesterPage tokenId={isToken}/>
                :      
                    <NotFoundWrapper>
                        <NotFoundText>
                            404: Not Found
                        </NotFoundText>
                    </NotFoundWrapper>
            }
        </>
    )
}