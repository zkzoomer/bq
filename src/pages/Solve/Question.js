import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from "styled-components"

import style from "../../styles/markdown-styles.module.css"
import { AnswerButton } from "../../components/Button"
import { answerKeyToLetter, answerKeyToNumber } from "./helpers"
import { theme } from "../../theme"

const QuestionBox = styled.div`
    width:  70%;
    border-radius: 5px;

    padding: 5px 15px 5px 15px;
    margin: 0px 10px 20px 10px;
    
    box-shadow: ${({hasError}) => (hasError ? `2px 2px 2px 1px var(--error)` : `2px 2px 2px 1px var(--main-text)`)};
    border: ${({hasError}) => (hasError ? `1px solid var(--error)` : `1px solid var(--main-text)`)};
    background-color: transparent;
    transition: all 0.2s ease-in-out;

    @media (max-width: ${theme.breakpoint}px) {
        width: 100%;
    }
`

const TopRow = styled.div`
    display: grid;
    grid-template-columns: auto auto; 
    justify-content: space-between;  
    align-content: space-between;  

    padding-top: 5px;
`

const TitleText = styled.div`
    font-family: 'Inter Bold';
    font-size: 1.2rem;
    text-align: justify;
    text-justify: inter-word;
`

const InputAnswersWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const AnswerWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;

    @media (max-width: ${theme.breakpoint}px) {
        flex-direction: column;
    }
`

const AnswerButtonsWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;

    padding-right: 10px;

    @media (max-width: ${theme.breakpoint}px) {
        padding-bottom: 15px;
        width: 100%;
        flex-direction: row;
    }
`

const RenderQuestionWrapper = styled.div`
    height: 100%;
    width: 100%;
    padding: 25px 25px 50px 25px;
`

const RenderAnswerWrapper = styled.div`
    height: 100%;
    max-width: 100%;
    padding: 0px 10px 25px 10px;
    word-wrap: break-word;
`

const RenderQuestionElement = ({ testQuestion }) => {
    return(
        <RenderQuestionWrapper>
            <ReactMarkdown className={style.reactMarkDown} children={testQuestion.Q} remarkPlugins={[remarkGfm]} />
        </RenderQuestionWrapper>
    )
}

const RenderAnswersElement = ({ testQuestion, answer, setAnswer }) => {

    const renderedAnswerBoxes = Object.entries(testQuestion.A).map(( [key, value] ) => {
        return(
            <AnswerWrapper key={key}>
                <AnswerButtonsWrapper>
                    <AnswerButton
                        disabled={answer===answerKeyToNumber(key)}
                        isClicked={answer===answerKeyToNumber(key)}
                        onClick={() => setAnswer(answerKeyToNumber(key))}
                    >
                        {answerKeyToLetter(key)}
                    </AnswerButton>
                </AnswerButtonsWrapper>
                <RenderAnswerWrapper>
                    <ReactMarkdown className={style.reactMarkDown} children={value} remarkPlugins={[remarkGfm]} />
                </RenderAnswerWrapper>
            </AnswerWrapper>
        )
    })

    return(
        <InputAnswersWrapper>
            {renderedAnswerBoxes}
        </InputAnswersWrapper>
    )
}


export default function Question ({ 
    id, 
    testQuestion, 
    answer,
    setAnswer,
    hasError
}) {

    return(
        <QuestionBox key={id} hasError={hasError}>
            <TopRow>
                <TitleText>
                    {'Question ' + id.substring(1)}
                </TitleText>
            </TopRow>
            <RenderQuestionElement testQuestion={testQuestion} />
            <RenderAnswersElement 
                testQuestion={testQuestion} 
                answer={answer}
                setAnswer={setAnswer}
            />
        </QuestionBox>
    )
}