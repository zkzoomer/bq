import styled from "styled-components"
import { NavLink } from 'react-router-dom';
import { theme } from "../../theme";

const explanationBreakpoint = 1200;

const ContentText = styled.div`
    color: var(--main-text);
    padding-left: 25%;
    padding-right:25%;
    font-family: 'Inter ExtraLight';
    font-size: 1.3rem;
    text-align: justify;
    text-justify: inter-word;

    @media (max-width: ${theme.breakpoint}px) {
        padding: 0;
    }
`

const InlineNavLink = styled(NavLink)`
    font-family: 'Inter ExtraLight';
    cursor: pointer;
    color: var(--alt-text);
`

const InlineLink = styled.a`
    font-family: 'Inter ExtraLight';
    cursor: pointer;
    color: var(--alt-text);
`

const ExplanationSection = styled.div`
    /* height: 500px; */
    width: 100%;
    /* padding-left: 15%;
    padding-right:15%; */
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: ${explanationBreakpoint}px) {
        flex-direction: column;
    }
`

const ExplanationText = styled.div`
    width: 50%;
    color: var(--main-text);
    padding: 10px 0px 10px 30px;
    font-family: 'Inter ExtraLight';
    font-size: 1.3rem;
    text-align: justify;
    text-justify: inter-word;

    @media (max-width: ${explanationBreakpoint}px) {
        width: 100%;
        padding: 30px 0px 10px 0px;
    }
`

const ExplanationTextItalics = styled.span`
    font-family: 'Inter ExtraLightItalic';
`

const ExplanationHighlightedText = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
    color: var(--alt-text);
    font-family: 'Inter BoldItalic';
    font-size: 1.3rem;
    text-align: justify;
    text-justify: inter-word;
`

const Image = styled.img`
    height: 100%;
    width: 50%;
    object-fit: contain;

    @media (max-width: ${explanationBreakpoint}px) {
        padding-top: 20px;
        width: 100%;
    }
`

export const accordionElements = [
    {
        name: "How do I gain a credential?",
        content: (
            <ContentText>
                The only way to get a credential is to correctly answer 
                <span style={{fontWeight:800, fontFamily: 'Inter ExtraLight'}}> all </span>
                the questions that make up its multiple choice test, esentially verifying that you know the subject.
                You can look at some available credentials in the <InlineNavLink to="/browse">Browse</InlineNavLink> section.
            </ContentText>
        )
    },
    {
        name: "How do I check my credentials?",
        content: (
            // TODO: add the polygonscan of the deployed version of the contract down here
            <ContentText>
                When you receive a credential, you get sent a certificate as a 
                <InlineLink href='https://mumbai.polygonscan.com/' target='_blank' aria_label='Twitter'> non-transferable NFT </InlineLink>
                validating your skills. You can look at all your gained credentials inside your 
                <InlineNavLink to="/profile"> Profile </InlineNavLink> page, as well as the credentials you created.
            </ContentText>
        )
    },
    {
        name: "Can I lose a credential?",
        content: (
            <ContentText>
                <span style={{fontWeight:800, fontFamily: 'Inter ExtraLight'}}>Yes</span>, 
                the owner of a credential can choose to delete it, voiding yours and all others in the process.
            </ContentText>
        )
    },
    {
        name: "How can I verify a credential?",
        content: (
            // TODO: add the polygonscan of the deployed version of the contract down here
            <ContentText>
                Each non-transferable Credential NFT is linked to its corresponding 
                <InlineLink href='https://mumbai.polygonscan.com/' target='_blank' aria_label='Twitter'> non-transferable Tester NFT. </InlineLink>
                The only way to gain a credential is to answer all of its questions correctly. Thanks to ZK-SNARKS, these answers get
                posted privately, so you can be sure that credentials cannot be attained by copying other's answers.
            </ContentText>
        )
    },
    {
        name: "How can I create a credential?",
        content: (
            <ContentText>
                You can do so inside the <InlineNavLink to="/create"> Create </InlineNavLink> section. You will provide an IPFS hash of a supported 
                Markdown document containing the questions, and specify the behavior of your multiple-choice test. 
                <br />
                To know what constitutes as a supoorted Markdown document, you can check the <InlineNavLink to="/help"> Help </InlineNavLink> page.
            </ContentText>
        )
    },
    {
        name: "But how does it all work?",
        content: (
            <ExplanationSection>
                <Image src={require('../../images/merkle_tree.png')} alt='Merkle Tree' />
                <ExplanationText>

                    <InlineLink href='https://en.wikipedia.org/wiki/Zero-knowledge_proof' target='_blank' aria_label='zk proof'>Zero-knowledge proofs </InlineLink>  
                    are used to submit and verify answers to these multiple-choice tests.
                    
                    <ExplanationHighlightedText>How is a multiple choice test defined?</ExplanationHighlightedText>

                    When you create a test, you must provide the<ExplanationTextItalics> solution hash </ExplanationTextItalics>that defines it, which is the 
                    Merkle root of the answers tree. This answers tree has a total of<ExplanationTextItalics> n </ExplanationTextItalics>leaves, each with 
                    <ExplanationTextItalics> m </ExplanationTextItalics>possible values: the multiple choices available.

                    <ExplanationHighlightedText>How do you submit a solution to a test?</ExplanationHighlightedText>

                    In your transaction, you don't submit a solution directly, as that would reveal it to the public. 
                    Instead, what you do is<span style={{fontWeight:800, fontFamily: 'Inter ExtraLightItalic'}}> you prove your knowledge </span>
                    of an answer tree such that, when its root is hashed alongside a random salt, it returns a <ExplanationTextItalics> solving hash. </ExplanationTextItalics>
                    <br />
                    Your answers remain<span style={{fontWeight:800, fontFamily: 'Inter ExtraLightItalic'}}> private </span>, while the
                    <ExplanationTextItalics> solving hash </ExplanationTextItalics>and<ExplanationTextItalics> salt </ExplanationTextItalics>are
                    public. The smart contract checks if your<ExplanationTextItalics> solving hash </ExplanationTextItalics>is the result of hashing 
                    your<ExplanationTextItalics> salt </ExplanationTextItalics>and the<ExplanationTextItalics> solution hash </ExplanationTextItalics>
                    defined earlier, and only then does it grant you the credential.
                    <br />
                    By voiding the<ExplanationTextItalics> salts </ExplanationTextItalics>that have been used, we can ensure the only way to gain a credential 
                    is to solve a test, and cheating becomes unfeasible.

                </ExplanationText>
            </ExplanationSection>
        )
    },
]