import { useLayoutEffect, useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from "styled-components"
import { FaTimes, FaCode, FaPlus } from 'react-icons/fa'
import { ViewIcon } from '@chakra-ui/icons'

import style from "../../styles/markdown-styles.module.css"
import { AddElementButton, AnswerButton, RemoveElementButton, SetPreviewButton } from "../../components/Button"
import { getNumberOfAnswers, answerKeyToLetter, answerKeyToNumber } from "./helpers"
import { MAX_ANSWERS } from "../../constants/values"
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
    height: 72px;
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

const TextareaBox = styled.textarea`
    width: 100%;
    height: 50px;
    border-radius: 5px;
    padding: 3px 0 3px 10px;
    margin: 4px 0px 4px 0px;
    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
    display: block;
    text-align: left;
    align-items: start;
    overflow: hidden;
    resize: none;

    transition: all 0.1s ease-in-out;

    ::placeholder {
        font-family: 'Inter ExtraLightItalic';
    }

    &:focus {
        outline: 0;
        border: 1px solid var(--alt-text);
        box-shadow: 0 0 0 white;
        margin: 6px 0px 2px 0px;
    }
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
    align-items: end;
    margin: 4px 0px 4px 0px;
    padding-right: 10px;

    @media (max-width: ${theme.breakpoint}px) {
       flex-direction: row;
    }
`

const RenderQuestionWrapper = styled.article`
    box-sizing: border-box;
    min-height: 150px;
    width: 100%;
    margin-top:auto;
    margin-bottom:auto;
    text-align:center; 
    padding: 15px 25px 5px 25px;

    /* height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: start;
    min-height: 150px;
    padding: 15px 25px 5px 25px; */
`

const RenderAnswerWrapper = styled.div`
    height: 100%;
    width: 100%;
    min-height: 87px;
    padding: 0px 10px 10px 10px;
`

const RenderDefaultText = styled.div`
    font-family: 'Inter ExtraLightItalic';
    text-align: left;
`

const InputQuestionElement = ({ testQuestion, handleQuestionChange }) => {
    const textareaRef = useRef(null)

    const MIN_TEXTAREA_HEIGHT = 150;

    useLayoutEffect(() => {
        // reset height to shrink on delete
        textareaRef.current.style.height = "inherit"
        // set height
        textareaRef.current.style.height =  `${Math.max(
            textareaRef.current.scrollHeight,
            MIN_TEXTAREA_HEIGHT
        )}px`;
    }, [testQuestion.Q])

    return(
        <TextareaBox
            type='text'
            ref={textareaRef}
            required
            onChange={handleQuestionChange}
            placeholder={'Type your question here, supports markdown'}
            value={testQuestion.Q}
        />
    )
}

const RenderQuestionElement = ({ testQuestion }) => {

    return(
        <RenderQuestionWrapper>
            {
                testQuestion.Q ? 
                    <ReactMarkdown className={style.reactMarkDown} children={testQuestion.Q} remarkPlugins={[remarkGfm]} />
                :
                    <RenderDefaultText>There is nothing to display here</RenderDefaultText>
            }
        </RenderQuestionWrapper>
    )
}

const AnswerInput = ({ answer, handleAnswersChange }) => {
    const textareaRef = useRef(null)

    const MIN_TEXTAREA_HEIGHT = 87;

    useLayoutEffect(() => {
        // reset height to shrink on delete
        textareaRef.current.style.height = "inherit"
        // set height
        textareaRef.current.style.height =  `${Math.max(
            textareaRef.current.scrollHeight,
            MIN_TEXTAREA_HEIGHT
        )}px`;
    }, [answer])

    return(
        <TextareaBox
            type='text'
            ref={textareaRef}
            required
            onChange={handleAnswersChange}
            placeholder={'Type an answer here, supports markdown'}
            value={answer}
        />
    )
}

const InputAnswersElement = ({ testQuestion, addAnswer, removeAnswer, correctAnswer, setCorrectAnswer, setAnswerText }) => {
    const isRemovable = (getNumberOfAnswers(testQuestion.A) > 1)

    const answerBoxes = Object.entries(testQuestion.A).map(( [key, value] ) => {
        return(
            value === null ? 
                null
            :
                <AnswerWrapper key={key}>
                    <AnswerButtonsWrapper>
                        <AnswerButton
                            disabled={correctAnswer===answerKeyToNumber(key)}
                            isClicked={correctAnswer===answerKeyToNumber(key)}
                            onClick={() => setCorrectAnswer(answerKeyToNumber(key))}
                        >
                            {answerKeyToLetter(key)}
                        </AnswerButton>
                        {
                            isRemovable ? 
                                <RemoveElementButton onClick={() => {removeAnswer(key)}}>
                                    <FaTimes />
                                </RemoveElementButton>
                            :
                                null
                        }
                    </AnswerButtonsWrapper>
                    <AnswerInput 
                        answer={value}
                        handleAnswersChange={(event) => {setAnswerText(key, event.target.value)}}
                    />
                </AnswerWrapper>
        )
    })

    return (
        <InputAnswersWrapper>
            {answerBoxes}
            {
                getNumberOfAnswers(testQuestion.A) === MAX_ANSWERS ? 
                    null
                : 
                    <AddElementButton onClick={addAnswer}><FaPlus />&nbsp;&nbsp;Add Answer</AddElementButton>
            }
        </InputAnswersWrapper>
    )
}

const RenderAnswersElement = ({ testQuestion, correctAnswer, setCorrectAnswer }) => {

    const renderedAnswerBoxes = Object.entries(testQuestion.A).map(( [key, value] ) => {
        return(
            value === null ? 
                null
            :
                <AnswerWrapper key={key}>
                    <AnswerButtonsWrapper>
                        <AnswerButton
                            disabled={correctAnswer===answerKeyToNumber(key)}
                            isClicked={correctAnswer===answerKeyToNumber(key)}
                            onClick={() => setCorrectAnswer(answerKeyToNumber(key))}
                        >
                            {answerKeyToLetter(key)}
                        </AnswerButton>
                    </AnswerButtonsWrapper>
                    <RenderAnswerWrapper>
                        {
                            value ? 
                                <ReactMarkdown className={style.reactMarkDown} children={value} remarkPlugins={[remarkGfm]} />
                            :
                                <RenderDefaultText>There is nothing to display here</RenderDefaultText>
                        }
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
    setQuestionText, 
    addAnswer,
    removeAnswer,
    correctAnswer,
    setCorrectAnswer,
    setAnswerText, 
    isRemovable, 
    removeQuestion,
    hasError
}) {

    const [previewMode, setPreviewMode] = useState(false)

    const handleQuestionChange = event => {
        const { name, value } = event.target;
        setQuestionText(
            value
        )
    }

    return(
        <QuestionBox key={id} hasError={hasError}>
            <TopRow>
                <TitleText>
                    {'Question ' + id.substring(1)}
                </TitleText>
                {
                isRemovable ?
                    <RemoveElementButton onClick={removeQuestion}>
                        <FaTimes />&nbsp;&nbsp;Remove
                    </RemoveElementButton>
                :
                    <div />
                }
                {
                previewMode ? 
                    <SetPreviewButton active={previewMode} onClick={() => {setPreviewMode(false)}}>
                        <FaCode />&nbsp;Edit
                    </SetPreviewButton>
                :
                    <SetPreviewButton active={previewMode} onClick={() => {setPreviewMode(true)}}>
                        <ViewIcon />&nbsp;Preview
                    </SetPreviewButton>
                }
            </TopRow>
            {
                previewMode ?
                    <RenderQuestionElement testQuestion={testQuestion} />
                :
                    <InputQuestionElement testQuestion={testQuestion} handleQuestionChange={handleQuestionChange}/>
            }
            {
                previewMode ? 
                    <RenderAnswersElement 
                        testQuestion={testQuestion} 
                        correctAnswer={correctAnswer}
                        setCorrectAnswer={setCorrectAnswer}
                    />
                :
                    <InputAnswersElement 
                        testQuestion={testQuestion} 
                        addAnswer={addAnswer} 
                        removeAnswer={removeAnswer} 
                        correctAnswer={correctAnswer}
                        setCorrectAnswer={setCorrectAnswer}
                        setAnswerText={setAnswerText}
                    />
            }
        </QuestionBox>
    )
}