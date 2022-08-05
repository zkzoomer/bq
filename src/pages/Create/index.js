import { useState } from "react"
import styled from "styled-components"

import ProgressBar from "./ProgressBar"
import PublishQuestions from "./PublishQuestions"
import SubmitCredential from "./SubmitCredential"
import { MAX_QUESTIONS } from "../../constants/values"
import { getNullAnswersDict, getNullAnswersFirstEmptyDict } from "./helpers"

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

const initialTest = {
    title: "",
    description: "",
}
const initialCorrectAnswers = []
for (var i = 1; i <= MAX_QUESTIONS; i++) {
    initialTest['Q' + i] = {
        Q: null,
        A: getNullAnswersDict('Q' + i)
    }
    initialCorrectAnswers.push(0)
}

// publish your questions to IPFS / submit your credential to the blockchain
export function Create () {
    const [progressBarState, setProgressBarState] = useState({
        active: 1,
        completed: [false, false]
    })
    const [test, setTest] = useState(initialTest)
    const [correctAnswers, setCorrectAnswers] = useState(initialCorrectAnswers)
    const [submission, setSubmission] = useState({
        credentialName: {value: "", error: ""},
        testerURI: {value: "", error: ""},
        solutionHash: {value: "", error: ""},
        requiredPass: {value: "", error: ""},
        credentialLimit: {value: "", error: ""},
        timeLimit: {value: "", error: ""},
        prize: {value: "", error: ""},
        _pinnedTester: "",  // pinned by the user when making a test
    })

    // Add one question on first load if there are none defined
    useState(() => {
        if (test.Q1.Q === null) {
            setTest( prevState => ({
                ...prevState,
                'Q1': { Q: "", A: getNullAnswersFirstEmptyDict('Q1') }
            }))
        }
    }, [])

    return (
        <CreateWrapper>
            <ProgressBar 
                isActive={progressBarState.active} 
                setIsActive={(page) => setProgressBarState(prevState => ({ ...prevState, active: page }))}
                isCompleted={progressBarState.completed}
            />
            <SectionWrapper>
                {
                    progressBarState.active === 1 ? 
                    <PublishQuestions
                        key='publishQuestions'
                        test={test}
                        setTest={setTest}
                        correctAnswers={correctAnswers}
                        setCorrectAnswers={setCorrectAnswers}
                        submission={submission}
                        setSubmission={setSubmission}
                        advanceSection={() => setProgressBarState(prevState => ({ ...prevState, active: 2 }))}    
                    /> 
                    : 
                    <SubmitCredential 
                        submission={submission} 
                        setSubmission={setSubmission} 
                        setProgressBarState={setProgressBarState} 
                    />
                }
            </SectionWrapper>
        </CreateWrapper>
    )
}