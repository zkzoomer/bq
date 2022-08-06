import React from 'react';
import { useSelector, useDispatch } from "react-redux"
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaTwitter, FaGithub, FaFish } from 'react-icons/fa';

import useClickOutside from '../../hooks/useClickOutside';
import { setIsOpen } from '../../state/sidebar/reducer';
import { MenuList } from '../../pages/menuList';
import { theme } from '../../theme';

const SidebarWrapper = styled.aside`
    position: fixed;
    z-index: 999;
    width: ${theme.sidebar_width}px;
    height: 100%;
    color: var(--light-text);
    background: var(--dark-background);

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    transition: 0.2s ease-in-out;
    opacity: ${({ isOpen }) => (isOpen ? '100%' : '0%')};
    left: ${({ isOpen }) => (isOpen ? '0%' : '-100%')};

`

const SidebarTitle = styled.div`
    height: 80px;
    width: 100%;
    font-size: 1.4rem;
    color: var(--highlighted-light-text);
    text-shadow: 2px 2px 1px var(--main-text);
    font-style: italic;
    font-weight: 600;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {   
        animation:shadow-move 0.75s linear infinite;
        color: var(--error);
    }

    @keyframes shadow-move {
        25% {
            color: var(--warning);
            text-shadow: 0px 0px 1px var(--main-text);
        }
        50% {
            text-shadow: -3px -3px 1px var(--main-text);
        }
        75% {
            color: var(--success);
            text-shadow: 0px 0px 1px var(--main-text);
        }
        100% {
            text-shadow: 3px 3px 1px var(--main-text);
        }
    }
`

const SidebarMenu = styled.div`
    display: grid;
    grid-template-rows: repeat(${MenuList.length}, 80px);
    width: 100%;
`

const activeclassname = 'active';
const SidebarLink = styled(NavLink).attrs({
    activeclassname,
})`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: var(--light-text);
    cursor: pointer;

    &.${activeclassname} {
        font-weight: 600;
        color: var(--highlighted-light-text);
        text-shadow: 2px 2px var(--main-text);
    }

    &:hover {
        color: var(--light-text);
    }
`

const IconWrapper = styled.div`
    ${SidebarLink}:hover & {   
        -webkit-animation:spin 3s linear infinite;
        -moz-animation:spin 3s linear infinite;
        animation:spin 3s linear infinite;
    }

    @-moz-keyframes spin {
        100% {
            -moz-transform: rotate(360deg);
        }
    }
    @-webkit-keyframes spin {
        100% {
            -webkit-transform: rotate(360deg);
        }
    }
    @keyframes spin {
        100% {
            -webkit-transform: rotate(360deg);
            transform:rotate(360deg);
        }
    }
`

const SidebarAbout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    padding-bottom: 15px;
`

const SidebarAboutText = styled.div`
    display: flex; 
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-style: italic;
    padding-bottom: 15px;
`

const IconLink = styled.a`
    color: var(--light-text);
    font-size: 24px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    padding: 0 10px 0 10px;

    &:hover{
        color: var(--highlighted-text);
        top: -10px;
        transform: scale(1.1);
    }
`

// TODO: make icons stay at rotated position
export default function Sidebar() {
    const isOpen = useSelector(state => state.sidebar.isOpen);
    const dispatch = useDispatch();

    let domNode = useClickOutside(() => {
        dispatch(setIsOpen(false))
    });

    const menuList = MenuList.map(({url, title, icon}, index) => {
        return(
            <SidebarLink key={index} exact="true" to={url} activeclassname="active" >
                <IconWrapper>{icon}</IconWrapper>
                &nbsp;&nbsp;&nbsp;
                {title}
            </SidebarLink>
        );
    });

    return (
        <SidebarWrapper ref={domNode} isOpen={ isOpen }>
            <div>
                <SidebarTitle>
                    block qualified
                </SidebarTitle>
                <SidebarMenu>
                    { menuList }
                </SidebarMenu>
            </div>
            <SidebarAbout>
                <SidebarAboutText>
                    <IconWrapper><FaFish /></IconWrapper>&nbsp;deenz was here
                </SidebarAboutText>
                <SidebarAboutText>
                    <IconLink href='https://twitter.com/0xdeenz' target='_blank' aria_label='Twitter'>
                        <FaTwitter />
                    </IconLink>
                    <IconLink href='https://github.com/0xdeenz/bq' target='_blank' aria_label='Github'>
                        <FaGithub />
                    </IconLink>
                </SidebarAboutText>
            </SidebarAbout>
        </SidebarWrapper>
    )
}




// https://youtu.be/eWO1b6EoCnQ