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