import {
    Modal,
    ModalOverlay,
    ModalContent,
} from "@chakra-ui/react";
import styled from 'styled-components';
import { Image } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connectors";

const ModalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100%;
    width: 100%;
    background-color: var(--main-background);
    color: var(--main-text);

    border-radius: 5px;
    padding: 15px;
    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);

    transition: all 0.2s ease-in-out;
`

const ModalHeader = styled.div`
    font-size: 1.3rem;
    padding-bottom: 10px;
`

const ModalButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center; 

    width: 100%;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: box-shadow, margin 0.2s ease-in-out;

    margin: 6px 10px 6px 10px;
    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
    &:hover {
        box-shadow: 0 0 0 white;
        margin: 8px 10px 4px 10px;
    }
`

const ButtonImage = styled.img`
    width: 22px;
    height: 22px;
    border-radius: 3px;
`

const ButtonText = styled.div`
    font-family: 'Inter ExtraLight';
    font-size: 1.1rem;
    padding-left: 7px;
`

  
export default function WalletModal ({ isOpen, closeModal }) {
    const { activate } = useWeb3React();

    const setProvider = (type) => {
        window.localStorage.setItem("provider", type);
    };

    // TODO: coinbase wallet sending redirect on mobile, WHY ??????
    return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        treefiddy
        <ModalContent w="300px">
            <ModalWrapper>
                <ModalHeader>Select Wallet</ModalHeader>
                <ModalButton
                    onClick={() => {
                        activate(connectors.injected);
                        setProvider("injected");
                        closeModal();
                        }}
                >
                    <ButtonImage
                        src={require("../../images/mm.png")}
                        alt="Metamask Logo"
                    />
                    <ButtonText>Metamask</ButtonText>
                </ModalButton>
                <ModalButton
                    onClick={() => {
                        activate(connectors.walletConnect);
                        setProvider("walletConnect");
                        closeModal();
                        }}
                >
                    <ButtonImage
                        src={require("../../images/wc.png")}
                        alt="Metamask Logo"
                    />
                    <ButtonText>Wallet Connect</ButtonText>
                </ModalButton>
                <ModalButton
                    onClick={() => {
                        activate(connectors.coinbaseWallet);
                        setProvider("coinbaseWallet");
                        closeModal();
                        }}
                >
                    <ButtonImage
                        src={require("../../images/cbw.png")}
                        alt="Metamask Logo"
                    />
                    <ButtonText>Coinbase Wallet</ButtonText>
                </ModalButton>
            </ModalWrapper>
        {/* <ModalHeader>Select Wallet</ModalHeader>
        <ModalCloseButton
            _focus={{
            boxShadow: "none"
            }}
        />
        <ModalBody paddingBottom="1.5rem">
            <VStack>
            <Button
                variant="outline"
                onClick={() => {
                activate(connectors.injected);
                setProvider("injected");
                closeModal();
                }}
                w="100%"
            >
                <HStack w="100%" justifyContent="center">
                <Image
                    src={require("../../images/mm.png")}
                    alt="Metamask Logo"
                    width={25}
                    height={25}
                    borderRadius="3px"
                />
                <Text>Metamask</Text>
                </HStack>
            </Button>
            <Button
                variant="outline"
                onClick={() => {
                activate(connectors.walletConnect);
                setProvider("walletConnect");
                closeModal();
                }}
                w="100%"
            >
                <HStack w="100%" justifyContent="center">
                <Image
                    src={require("../../images/wc.png")}
                    alt="Wallet Connect Logo"
                    width={26}
                    height={26}
                    borderRadius="3px"
                />
                <Text>Wallet Connect</Text>
                </HStack>
            </Button>
            <Button
                variant="outline"
                onClick={() => {
                activate(connectors.coinbaseWallet);
                setProvider("coinbaseWallet");
                closeModal();
                }}
                w="100%"
            >
                <HStack w="100%" justifyContent="center">
                <Image
                    src={require("../../images/cbw.png")}
                    alt="Coinbase Wallet Logo"
                    width={25}
                    height={25}
                    borderRadius="3px"
                />
                <Text>Coinbase Wallet</Text>
                </HStack>
            </Button>
            </VStack>
        </ModalBody> */}
        </ModalContent>
    </Modal>
    );
}
  