import { useState } from "react"
import styled from "styled-components"

import ProgressBar from "./ProgressBar"
import PublishQuestions from "./PublishQuestions"
import SubmitCredential from "./SubmitCredential"

const CreateWrapper = styled.div`
    width: 100%;
    background-color: var(--main-background);
    padding-bottom: 100px;
`

const SectionWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

// publish your questions to IPFS / submit your credential to the blockchain

export function Create () {
    const [isActive, setIsActive] = useState(1);
    const [isCompleted, setIsCompleted] = useState([false, false])

    return (
        <CreateWrapper>
            <ProgressBar isActive={isActive} setIsActive={setIsActive} isCompleted={isCompleted}/>
            <SectionWrapper>
                {
                    isActive === 1 ? 
                    <PublishQuestions /> 
                    : 
                    <SubmitCredential />
                }
            </SectionWrapper>
        </CreateWrapper>
    )
}