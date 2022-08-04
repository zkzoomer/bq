import styled, { css } from "styled-components"
import { NavLink } from 'react-router-dom';
import { theme } from "../../theme";

export const SendToButton = styled(NavLink)`
    display: flex;
    align-items: center;
    justify-content: center; 

    border-radius: 5px;
    padding: 5px 15px 5px 15px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    color: var(--main-text);

    margin: 4px 10px 4px 10px;
    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
    background-color: transparent;
    &:hover {
        color: var(--main-text);
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
    
    width: 220px;
    height: 35px;
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

export const AddElementButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center; 
    
    width: 10%;
    min-width: 220px;
    height: 25px;
    border-radius: 5px;
    margin-bottom: 30px;
    padding: 5px 15px 5px 15px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    margin: 4px 10px 4px 10px;
    border: 1px solid var(--main-text);
    box-shadow: 2px 2px 2px 1px var(--main-text);
    background-color: transparent;
    color: var(--main-text);

    &:hover {
        box-shadow: 0 0 0 white;
        margin: 6px 10px 2px 10px;
    }
`

export const RemoveElementButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center; 

    width: 100%;
    height: 25px;
    border-radius: 5px;
    padding: 5px 15px 5px 15px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    margin: 4px 0 4px 0;
    border: 1px solid var(--main-text);
    box-shadow: 2px 2px 2px 1px var(--main-text);
    background-color: transparent;
    color: var(--main-text);

    &:hover {
        background-color: var(--error);
        box-shadow: 0 0 0 white;
        margin: 6px 0 2px 0;
    }
`

export const SetPreviewButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center; 
    
    width: 105px;
    height: 25px;
    border-radius: 5px;
    margin-bottom: 30px;
    padding: 5px 15px 5px 15px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    border: 1px solid var(--main-text);
    margin: ${({active}) => (active ? `6px 0px 2px 0px` : `4px 0px 4px 0px`)};
    box-shadow: ${({active}) => (active ? `0 0 0 white` : `2px 2px 2px 1px var(--main-text)`)};
    background-color: ${({active}) => (active ? `var(--alt-text)` : `transparent`)};
    color: ${({active}) => (active ? `var(--light-text)` : `var(--main-text)`)};
`

export const UploadButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center; 
    
    width: 220px;
    height: 50px;
    border-radius: 5px;
    padding: 5px 15px 5px 15px;
    font-size: 16px;
    cursor: ${({isEnabled}) => (isEnabled ? `pointer` : `default`)};
    transition: all 0.2s ease-in-out;

    margin: 4px 15px 4px 15px;
    border: 1px solid var(--main-text);
    box-shadow: ${({isEnabled}) => (isEnabled ? `2px 2px 2px 1px var(--main-text)` : `0 0 0 white`)};
    background-color: ${({isEnabled}) => (isEnabled ? `var(--alt-text)` : `transparent`)};
    color: ${({isEnabled}) => (isEnabled ? `var(--light-text)` : `var(--main-text)`)};

    &:hover {
        box-shadow: 0 0 0 white;
        margin-top: ${({isEnabled}) => (isEnabled ? `6px` : `4px`)};
        margin-bottom: ${({isEnabled}) => (isEnabled ? `2px` : `4px`)};
    }

    @media (max-width: ${theme.breakpoint}px) {
        margin-top: 10px;
        margin-bottom: 10px;

        &:hover {
            box-shadow: 0 0 0 white;
            margin-top: ${({isEnabled}) => (isEnabled ? `12px` : `10px`)};
            margin-bottom: ${({isEnabled}) => (isEnabled ? `8px` : `10px`)};
        }
    }
`

export const AnswerButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center; 
    
    width: 100%;
    height: 25px;
    border-radius: 5px;
    padding: 5px 15px 5px 15px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    margin: 4px 0px 4px 0px;
    margin: ${({isClicked}) => (isClicked ? `6px 0px 2px 0px` : `4px 0px 4px 0px`)};
    border: 1px solid var(--main-text);
    box-shadow: ${({isClicked}) => (isClicked ? `0 0 0 white` : `2px 2px 2px 1px var(--main-text)`)};
    background-color: ${({isClicked}) => (isClicked ? `var(--success)` : `transparent`)};
    color: var(--main-text);
    /* color: ${({isClicked}) => (isClicked ? `var(--light-text)` : `var(--main-text)`)}; */

    @media (max-width: ${theme.breakpoint}px) {
        margin-right: 10px;
    }
`