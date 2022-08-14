import React, { useState } from 'react';
import styled from 'styled-components';
import { FaAngleUp } from "react-icons/fa";

import { accordionElements } from './accordionElements';
import { theme } from '../../theme';

const SectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 80%;
    padding-bottom: 100px;
`

const SectionTitle = styled.div`
    font-family: 'Inter Bold';
    font-size: 2rem;
    color: var(--alt-text);
    padding-bottom: 30px;
`

const AccordionContainer = styled.div`
    width: 100%;
`

const Header = styled.button`
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 25%;
    padding-right:25%;
    width: 100%;
    height: 4rem;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: ${props => props.isActive ? 'Inter BoldItalic' : 'Inter Regular'};
    color: ${props => props.isActive ? `var(--alt-text)` : `var(--main-text)`};

    @media (max-width: ${theme.breakpoint}px) {
        padding: 0;
        font-size: 1.3rem;
        margin: 10px 0 10px 0;
    }
`

const HeaderIcon = styled.span`
    transform: rotate(${props => props.isActive ? -180 : 0 }deg);
    transition: all 0.2s;
    color: var(--main-text);
`

const Content = styled.div`
    position: relative;
    overflow: hidden; 
    height: ${props => {
        const inner = document.getElementById(props.itemName);
        return `${props.isActive && inner ? inner.clientHeight : 0}px`;
    }};
    transition: height 0.35s;
`

const Inner = styled.div`
    width: 100%;
    position: absolute;
    padding: 1rem;
`

const AccordionContent = ({onClick, itemName, itemContent, isActive}) => {
    return(
        <>
            <Header isActive={isActive} onClick={onClick}>
                {itemName}
                <HeaderIcon isActive={isActive} className='material-icons'>
                    <FaAngleUp />
                </HeaderIcon>
            </Header>
            <Content itemName={itemName} isActive={isActive}>
                <Inner id={itemName}>
                    {itemContent}
                </Inner>
            </Content>
        </>
    )
}

export default function HomeAccordion ({ items }) {

    const [active, setActive] = useState();

    const handleClick = (name) => {
        setActive(name === active ? null : name)
    }

    return(
        <SectionWrapper>
            <SectionTitle>
                We know you have questions
            </SectionTitle>
            <AccordionContainer>
                {accordionElements.map((item, index) => {
                    let isActive = active === item.name;
                    return (
                        <AccordionContent 
                            key={index}
                            onClick={() => handleClick(item.name)}
                            itemName={item.name}
                            itemContent={item.content}
                            isActive={isActive}
                        />
                    );
                })}
            </AccordionContainer>
        </SectionWrapper>
        
    )
}

