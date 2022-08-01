import { NavLink } from "react-router-dom"
import styled from "styled-components"

const SectionTitle = styled.div`
    font-size: 1.7rem;
    color: var(--alt-text);
    padding-top: 30px;
    padding-bottom: 15px;
`

const SectionSubTitle = styled.div`
    font-size: 1.2rem;
    font-family: 'Inter ExtraLight';
    color: var(--main-text);
`

const InlineNavLink = styled(NavLink)`
    font-family: 'Inter ExtraLight';
    cursor: pointer;
    color: var(--alt-text);
`

export default function PublishQuestions () {
    return(
        <>
            <SectionTitle>
                Step 1: Create your multiple choice test and publish it to IPFS
            </SectionTitle>
            <SectionSubTitle>
                If you already uploaded your
                <InlineNavLink to="/help"> supported markdown file, </InlineNavLink>
                you can skip this step.
            </SectionSubTitle>
        </>
    )
}