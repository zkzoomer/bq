import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core';
import styled from "styled-components";
import { ChevronDownIcon } from '@chakra-ui/icons'

import { setSelectedChain } from '../../state/chain/reducer';
import { CHAIN_IDS_NETWORK_PARAMETERS } from '../../constants/chains';
import useClickOutside from '../../hooks/useClickOutside';

const Wrapper = styled.div`
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; 
`

const ChainButton = styled.button`
    width: 70px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between; 
    text-align: left;

    padding: 0 5px 0 5px;
    margin: 4px 0px 4px 10px;

    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: box-shadow, margin 0.2s ease-in-out;
    
    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
    &:hover {
        box-shadow: 0 0 0 white;
        margin: 6px 0px 2px 10px;
    }
`

const ChainButtonImage = styled.img`
    width: 33px;
    border-radius: 3px;

`

const ArrowWrapper = styled.span`
    margin-top: 2px;
    transition: all 0.2s;
    transform: rotate(${props => props.isActive ? -180 : 0 }deg);
`

const Arrow = styled(ChevronDownIcon)`
    color: var(--main-tex);
    font-size: 1.5rem;
`

const DropdownWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    text-align: left;
    height: 72px;
    width: 190px;
	position: absolute;
	top: 85%;
    z-index: 999;
    margin-left: 130px;

    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
`

const DropdownUpperButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    
    width: 100%;
    height: 36px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border-radius: 5px 5px 0 0;
    z-index: 999;

    position: relative;

    background-color: ${({active}) => (active ? `var(--alt-text)` : `var(--main-background)`)};
    color: ${({active}) => (active ? `var(--light-text)` : `var(--main-text)`)};
`

const DropdownMiddleButton = styled.button`

`

const DropdownBottomButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center; 
    
    width: 100%;
    height: 36px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border-radius: 0 0 5px 5px;
    z-index: 999;

    position: relative;
    
    background-color: ${({active}) => (active ? `var(--alt-text)` : `var(--main-background)`)};
    color: ${({active}) => (active ? `var(--light-text)` : `var(--main-text)`)};
`

export default function ChainSelector () {
    const [isActive, setIsActive] = useState(false);

    const selectedChain = useSelector(state => state.chain.selectedChain);
    const dispatch = useDispatch();

    const {
        library,
    } = useWeb3React();

    let domNode = useClickOutside(() => {
        if (isActive) {
            setIsActive(false)
        }
    });

    const switchNetwork = async ( chain ) => {
        dispatch(setSelectedChain(chain))
        try {
          await library.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: CHAIN_IDS_NETWORK_PARAMETERS[chain].chainId }]
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await library.provider.request({
                method: "wallet_addEthereumChain",
                params: [CHAIN_IDS_NETWORK_PARAMETERS[chain]]
              });
            } catch (error) {
              console.log(error);
            }
          }
        }
    };

    return(
        <Wrapper ref={domNode}>
            <ChainButton onClick={() => setIsActive(!isActive)}>
                <ChainButtonImage
                    src={require(`../../images/${selectedChain}.png`)}
                    alt="chain"
                />
                <ArrowWrapper isActive={isActive} className='material-icons'><Arrow /></ArrowWrapper>
            </ChainButton>
            {
                isActive ? 
                <DropdownWrapper>
                    <DropdownUpperButton 
                        active={selectedChain === 'polygon_mumbai'} 
                        disabled={selectedChain === 'polygon_mumbai'}
                        onClick={() => { switchNetwork('polygon_mumbai') }}
                    >
                        <ChainButtonImage
                            src={require(`../../images/polygon_mumbai.png`)}
                            alt="chain"
                        />
                        &nbsp;&nbsp;Mumbai Testnet
                    </DropdownUpperButton>
                    <DropdownBottomButton 
                        active={selectedChain === 'evmos_testnet'} 
                        disabled={selectedChain === 'evmos_testnet'}
                        onClick={() => { switchNetwork('evmos_testnet') }}
                    >
                        <ChainButtonImage
                            src={require(`../../images/evmos_testnet.png`)}
                            alt="chain"
                        />
                        &nbsp;&nbsp;EVMOS Testnet
                    </DropdownBottomButton>
                </DropdownWrapper>
                :
                null
            }
        </Wrapper>
    )
}