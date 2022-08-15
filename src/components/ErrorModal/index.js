import React, { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';

const Background = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 100;

    transition: background-color 0.2s ease-in-out;
    display: block;
    top: ${({ showModal }) => (showModal ? '0%' : '-100%')};
    background-color: ${({ showModal }) => (showModal ? 'rgba(0, 0, 0, 0.25)' : 'transparent')};
`

const ModalWrapper = styled.div`
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    padding: 10px 0px 10px 0px;
    max-width: 700px;
    background-color: var(--main-background);
    color: var(--error);
    position: relative;
    z-index: 100;
    border-radius: 10px;

    box-shadow: 2px 2px 2px 1px var(--error);
    border: 1px solid var(--error);

    display: flex;
    align-items: center;

    
    transition: 0.2s ease-in-out;
    top: ${({ showModal }) => (showModal ? '0%' : '-100%')};
`;

const ModalContent = styled.div`
    flex-direction: column;
    padding: 5px 50px 0px 15px;
    line-height: 1.8;
    z-index: 100;
    width: 100%;
`;

const ModalText = styled.h1`
    width: 100%;
    font-family: 'Inter Bold';
    color: var(--error);
    font-size: 1.3rem;
    text-align: justify;
    text-justify: inter-word;
`

const ModalSubtext = styled.h1`
    padding-top: 5px;
    padding-bottom: 5px;
    width: 100%;
    font-family: 'Inter ExtraLightItalic';
    color:  var(--main-text);
    font-size: 1rem;
    text-align: justify;
    text-justify: inter-word;
`

const CloseModalButton = styled(MdClose)`
    color: var(--main-text);
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    height: 25px;
    width: 25px;
    padding: 0;
    z-index: 100;

    &:hover{
        transition: 0.2s all ease;
        transform: scale(1.1);
    }
`;

// TODO: modal not having a smooth transition down
export default function ErrorModal ({ errorMessage, closeModal }) {
    const modalRef = useRef();

    const showModal = () => {
        return errorMessage.length !== 0
    }

    const backgroundCloseModal = e => {
        if (modalRef.current === e.target) {
        closeModal();
        }
    };

    const keyPress = useCallback(
        e => {
            if ( e.key === 'Escape' && showModal() ) {
                closeModal();
            }
        },
        [showModal()]
    );

    useEffect(
        () => {
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);
        },
        [keyPress]
    );

    return (
        <Background showModal={showModal()} onClick={backgroundCloseModal} ref={modalRef}>
            <ModalWrapper showModal={showModal()}>
                <ModalContent>
                    <ModalText>{errorMessage[0]}</ModalText>
                    <ModalSubtext>{errorMessage[1]}</ModalSubtext>
                </ModalContent>
                <CloseModalButton
                    aria-label='Close modal'
                    onClick={closeModal}
                />
            </ModalWrapper>
        </Background>
    );
};