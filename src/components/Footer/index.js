import styled from "styled-components"

const FooterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 40px;
    background-color: var(--main-background);
`

const DividerLine = styled.hr`
    height: 100%;
    width: 90%;
    border-top: 1px solid var(--divider);;
`

const FooterContents = styled.div`
    font-family: 'Inter ExtraLightItalic';
    padding-bottom: 5px;
`


export function Footer () {
    return(
        <FooterWrapper>
            <DividerLine />
            <FooterContents>
                2022 | block qualified
            </FooterContents>
        </FooterWrapper>
    )
}