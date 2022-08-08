import styled from "styled-components"

const FooterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 40px;
    background-color: var(--main-background);
`

const FooterContents = styled.div`
    width: 90%;
    height: 100%;
    border-top: 1px solid var(--divider);
    font-family: 'Inter ExtraLightItalic';
    padding-top: 5px;
`


export function Footer () {
    return(
        <FooterWrapper>
            <FooterContents>
                2022 | block qualified
            </FooterContents>
        </FooterWrapper>
    )
}