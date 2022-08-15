import { useLayoutEffect, useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from "styled-components"

import { theme } from "../../theme"

const Box = styled.div`
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

const TopText = styled.div`
    font-family: 'Inter Bold';
    font-size: 1.2rem;
    text-align: justify;
    text-justify: inter-word;
    padding-top: 5px;
`

const Row = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: start;

    padding-top: 3px;
    padding-bottom: 3px;

    @media (max-width: ${theme.breakpoint}px) {
        flex-direction: column;
    }
`

const RowTitle = styled.div`
    height: 100%;
    width: 110px;
    display: flex;
    margin-top: 5px;
    
    text-align: justify;
    text-justify: inter-word;
    @media (max-width: ${theme.breakpoint}px) {
        width: 100%;
    }
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

const InputBox = styled.input`
    width: 100%;
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

const InputTitle = ({ title, setTitle }) => {
    return(
        <InputBox 
            type='text'
            required
            onChange={setTitle}
            placeholder={'Type your title here in plain text'}
            value={title}
        />
    )
}

const InputDescription = ({ description, setDescription }) => {
    const textareaRef = useRef(null)

    const MIN_TEXTAREA_HEIGHT = 80;

    useLayoutEffect(() => {
        // reset height to shrink on delete
        textareaRef.current.style.height = "inherit"
        // set height
        textareaRef.current.style.height =  `${Math.max(
            textareaRef.current.scrollHeight,
            MIN_TEXTAREA_HEIGHT
        )}px`;
    }, [description])

    return(
        <TextareaBox 
            type='text'
            ref={textareaRef}
            required
            onChange={setDescription}
            placeholder={'Type your description here in plain text'}
            value={description}
        />
    )
}

export default function TitleAndDescription ({ test, setTest, hasError }) {

    const setTitle = (event) => {
        setTest( prevState => ({
            ...prevState,
            'title': event.target.value
        }))
    }

    const setDescription = (event) => {
        setTest( prevState => ({
            ...prevState,
            'description': event.target.value
        }))
    }

    return ( 
        <Box hasError={hasError}>
            <TopText>
                Define your multiple choice test
            </TopText>
            <Row>
                <RowTitle>
                    Title:
                </RowTitle>
                <InputTitle title={test.title} setTitle={setTitle} />
            </Row>
            <Row>
                <RowTitle>
                    Description:
                </RowTitle>
                <InputDescription title={test.description} setDescription={setDescription} />
            </Row>
        </Box>
    )
}