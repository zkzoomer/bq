import styled, { css } from "styled-components"
import { NavLink } from 'react-router-dom';

export const SendToButton = styled(NavLink)`
    display: flex;
    align-items: center;
    justify-content: center; 

    border-radius: 5px;
    padding: 5px 15px 5px 15px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    margin: 4px 10px 4px 10px;
    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
    background-color: transparent;
    &:hover {
        box-shadow: 0 0 0 white;
        margin: 6px 10px 2px 10px;
    }
`

export const ProgressButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center; 

    border-radius: 5px;
    height: 50px;
    width: 50px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    border: 1px solid var(--main-text);
    background-color: ${({isCompleted}) => (isCompleted ? `var(--alt-text)` : `transparent`)};
    color: ${({isCompleted}) => (isCompleted ? `var(--light-text)` : `var(--main-text)`)};
    margin: 4px 10px 4px 10px;

    box-shadow: ${({isActive}) => (isActive ? `0 0 0 white` : `2px 2px 2px 1px var(--main-text)`)};
    /* margin: ${({isActive}) => (isActive ? `4px 10px 4px 10px` : `6px 10px 2px 10px`)}; */

    &:hover {
        box-shadow: 0 0 0 white;
        margin: ${({isActive}) => (isActive ? `4px 10px 4px 10px` : `6px 10px 2px 10px`)};
        /* margin: 6px 10px 2px 10px; */
    }
`

export const SubmitButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center; 

    border-radius: 5px;
    margin-bottom: 30px;
    padding: 5px 15px 5px 15px;
    font-size: 16px;
    cursor: ${({isEnabled}) => (isEnabled ? `pointer` : `default`)};
    transition: all 0.2s ease-in-out;

    margin: 4px 10px 4px 10px;
    border: 1px solid var(--main-text);
    box-shadow: ${({isEnabled}) => (isEnabled ? `2px 2px 2px 1px var(--main-text)` : `0 0 0 white`)};
    background-color: ${({isEnabled}) => (isEnabled ? `var(--alt-text)` : `transparent`)};
    color: ${({isEnabled}) => (isEnabled ? `var(--light-text)` : `var(--main-text)`)};

    &:hover {
        box-shadow: 0 0 0 white;
        margin: ${({isEnabled}) => (isEnabled ? `6px 10px 2px 10px` : `4px 10px 4px 10px`)};
    }
`