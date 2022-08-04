import styled from "styled-components"

import { DEPLOYED_CONTRACTS_ON_EXPLORER } from "../../constants/chains"
import { theme } from "../../theme"

const HelpWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 100%;
    background-color: var(--main-background);
    padding-top: 50px;
    min-height: 90vh;
`

const TextWrapper = styled.div`
    width: 80%;

    @media (max-width: ${theme.breakpoint}px) {
        width: 100%;
    }
`

const SectionHeadText = styled.div`
    font-family: 'Inter Bold';
    color: var(--alt-text);
    font-size: 1.6rem;
    text-align: justify;
    text-justify: inter-word;
    padding-bottom: 10px;
`

const SectionBodyText = styled.div`
    font-family: 'Inter ExtraLight';
    color: var(--main-text);
    font-size: 1.2rem;
    text-align: justify;
    text-justify: inter-word;
`

const InlineLink = styled.a`
    &:hover {
        color: var(--main-text);
    }
`

const InlineQuote = styled.span`
    font-family: 'Inter';
    font-style: italic;
`


export function Help () {

    const link  = DEPLOYED_CONTRACTS_ON_EXPLORER[80001].TesterCreator

    return (
        <HelpWrapper>
            <TextWrapper>
                <SectionHeadText>
                    What is the<span style={{fontFamily: 'Inter BoldItalic'}}> supported markdown </span>format?
                </SectionHeadText>
                <SectionBodyText>
                    Every 
                    <InlineLink href={link} target='_blank' aria_label='PolygonScan'> Block Qualified Tester (BQT) </InlineLink>
                    links to an external URI which must define all its corresponding multiple choice questions. While this URI can have 
                    any format, the Block Qualified frontend does support markdown files with specific formatting, called supported 
                    markdown format. 
                    <br /><br />
                    This special formatting allows us to easily embed your questions into our frontend, while still giving you great 
                    freedom to create and format your own credentials. Users can use the Block Qualified frontend to attempt to solve 
                    your multiple choice tests with the easiness that our website provides.
                    <br /><br />
                    The supported markdown format requires you define each question and answer by adding two leading strings:
                    <br />&emsp;&emsp;&emsp;— <InlineQuote>&lt;br /&gt;BLOCK_QUALIFIED_QUESTION_START&lt;br /&gt;</InlineQuote>, placed at the start of each question
                    <br />&emsp;&emsp;&emsp;— <InlineQuote>&lt;br /&gt;BLOCK_QUALIFIED_ANSWER_START&lt;br /&gt;</InlineQuote>, placed at the start of each answer
                    <br /><br />
                    Simply add these two special strings where needed and our frontend will render your multiple choice test and give users the
                    ability to solve it natively.
                    <br /><br />
                    Or, you can just use our frontend to generate your credentials. Multiple choice tests created using the Block Qualified frontend 
                    will automatically include these leading strings.
                </SectionBodyText>
            </TextWrapper>
        </HelpWrapper>
    )
}