import { useState } from "react"
import { NavLink } from "react-router-dom"
import styled from "styled-components"
import { SubmitButton } from "../../components/Button"

const SectionTitle = styled.div`
    font-size: 1.7rem;
    color: var(--alt-text);
    padding-top: 30px;
    padding-bottom: 30px;
`

const SubmitBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; 

    width:  25%;
    min-width: 380px;
    border-radius: 5px;
    padding: 5px 15px 5px 15px;

    margin: 4px 10px 4px 10px;
    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
    background-color: transparent;
`

const SubmitWrapper = styled.div`
    width: 100%;
    padding-top: 20px;
`

const SpecialInputRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-bottom: 20px;
`

const PrizeInputWrapper = styled.div`
    width: 100%;
    height: 85px;
    display: flex;
    flex-direction: column;
    text-align: justify;
    text-justify: inter-word;
`

const InputWrapper = styled.div`
    padding: 0px 10px 0px 10px;
    height: 85px;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const InputName = styled.div`
    font-family: 'Inter Bold';
    text-align: justify;
    text-justify: inter-word;
`

const InputBox = styled.input`
    width: 100%;
    border-radius: 5px;
    padding: 3px 0 3px 10px;
    margin: 4px 0px 4px 0px;
    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
    text-align: justify;
    text-justify: inter-word;

    ::placeholder {
        font-family: 'Inter ExtraLightItalic';
    }

    &:focus {
        border: 1px solid var(--main-text);
        box-shadow: 0 0 0 white;
        margin: 6px 0px 2px 0px;
    }
`

const ErrorText = styled.div`
    font-family: 'Inter ExtraLightItalic';
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--error);
    text-align: justify;
    text-justify: inter-word;
`

const PrizeInputBoxWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const PrizeInputCurrency = styled.div`
    width: 100%;
    font-weight: 800;
    font-family: 'Inter ExtraLight';
    margin-left: -20px;
`

const InlineNavLink = styled(NavLink)`
    font-family: 'Inter Bold';
    cursor: pointer;
    color: var(--alt-text);
`

const Buffer = styled.div`
    width: 30px;
`

const ButtonWrapper = styled.div`
    padding-bottom: 20px;
`



// credential name
// tester IPFS link - URI
// solution hash
// time limit - for now just raw integer
// credential limit
// needed pass
// prize


export default function SubmitCredential () {
    const [isEnabled, setIsEnabled] = useState(true);
    const [submission, setSubmission] = useState({
        credentialName: {value: "", error: ""},
        testerURI: {value: "", error: ""},
        solutionHash: {value: "", error: ""},
        neededPass: {value: "", error: ""},
        credentialLimit: {value: "", error: ""},
        timeLimit: {value: "", error: ""},
        prize: {value: "", error: ""},
    })

    const inputs = [
        { name: 'credentialName', placeholder: "Name your credential", label: 'Credential name' },
        { name: 'testerURI', placeholder: "Upload your test to IPFS and link it here", label: (<><InlineNavLink to='/help'>Supported markdown</InlineNavLink> tester URI</>) },
        { name: 'solutionHash', placeholder: "Solution hash of your multiple choice test", label: 'Answers tree root'},
        { name: 'neededPass', placeholder: "Leave empty for not needed", label: 'NFT pass required to solve' },
        /* { name: 'credentialLimit', label: 'Maximum number of credentials to give'}, */
        { name: 'timeLimit', placeholder: "Leave empty for unlimited", label: 'Test deadline' },
    ]

    const handleChange = () => {

    }

    const inputItems = inputs.map(( item, index) => {
        return(
            <InputWrapper>
                <InputName>{item.label}</InputName>
                <InputBox 
                    type='text'
                    id={item.name}
                    onChange={handleChange}
                    placeholder={item.placeholder}
                    value={submission[item.name].value}
                />
                <ErrorText>{submission[item.name].error}</ErrorText>
            </InputWrapper>
        )
    })

    return(
        <>
            <SectionTitle>
                    Step 2: Define your credential and submit it to the blockchain
                </SectionTitle>
            <SubmitBox>
                <SubmitWrapper>
                    {inputItems}
                </SubmitWrapper>
                <SpecialInputRow>
                    <InputWrapper>
                        <InputName>Max. credentials</InputName>
                        <InputBox              
                            type='text'
                            id='credentialLimit'
                            onChange={handleChange}
                            placeholder='Empty for unlimited'
                            value={submission.credentialLimit.value}
                        />
                        <ErrorText>{submission.credentialLimit.error}</ErrorText>
                    </InputWrapper>
                    <Buffer />
                    <PrizeInputWrapper>
                        <InputName>Prize to first solver</InputName>
                            <PrizeInputBoxWrapper>
                                <InputBox 
                                    type='text'
                                    id='prize'
                                    onChange={handleChange}
                                    placeholder='0'
                                    value={submission.prize.value}
                                />
                                <PrizeInputCurrency>MATIC</PrizeInputCurrency>
                            </PrizeInputBoxWrapper>
                        <ErrorText>{submission.prize.error}</ErrorText>
                    </PrizeInputWrapper>
                </SpecialInputRow>
                <ButtonWrapper>
                    <SubmitButton isEnabled={isEnabled}>
                        Create your credential
                    </SubmitButton>
                </ButtonWrapper>
                
            </SubmitBox>
        </>
    )
}