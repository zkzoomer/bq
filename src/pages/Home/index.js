import styled from "styled-components"
import { FaArrowRight } from "react-icons/fa"

import { SendToButton } from "../../components/Button"
import { theme } from "../../theme"
import HomeAccordion from "../../components/HomeAccordion"
import { accordionElements } from "../../components/HomeAccordion/accordionElements"

const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; 
    width: 100%;
    height: 100%;
`

const LandingSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; 
    margin-left: 10%;
    margin-right: 10%;
    max-width: 900px;
    height: calc(100vh - 80px);
    padding-bottom: 80px;
`

const LandingText = styled.h1`
    color: ${({main}) => (main ? `var(--alt-text)` : `var(--main-text)`)};
    font-size: ${({main}) => (main ? `3rem` : `2rem`)};
    font-family: ${({main}) => (main ? `Inter Bold` : `Inter ExtraLightItalic`)};
    padding-bottom: 20px;

    @media (max-width: ${theme.breakpoint}px) {
        font-size: ${({main}) => (main ? `2rem` : `1.33rem`)};
    }
`

export function Home () {
    return (
        <HomeWrapper>
            <LandingSection>
                <LandingText main={true}>
                    Get credentials by solving multiple-choice tests directly on-chain                    
                </LandingText>
                <LandingText>
                    Solve tests privately and verify them trustlessly, powered by ZK-SNARKS
                </LandingText>
                <SendToButton to='/browse'>
                    Get Block Qualified&nbsp;&nbsp;<FaArrowRight />
                </SendToButton>
            </LandingSection>
            <HomeAccordion items={accordionElements} />
        </HomeWrapper>
    )
}