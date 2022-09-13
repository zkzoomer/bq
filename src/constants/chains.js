import { ethers } from "ethers"; 

export const NAMES_TO_CHAIN_IDS = {
    'polygon_mumbai': 80001,
    'evmos_testnet': 9000,
}

export const CHAIN_IDS_TO_NAMES = {
    80001: 'polygon_mumbai',
    9000: 'evmos_testnet',
}

export const CHAIN_IDS_TO_HUMAN_NAMES = {
    80001: 'Mumbai Testnet',
    9000: 'EVMOS Testnet',
}

export const ALL_SUPPORTED_CHAIN_IDS = Object.values(NAMES_TO_CHAIN_IDS)

export const CURRENCIES = {
    'polygon_mumbai': 'MATIC',
    'evmos_testnet': 'EVMOS',
}

export const CHAIN_IDS_NETWORK_PARAMETERS = {
    "polygon_mumbai": {
        chainId: "0x13881",
        rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
        chainName: "Mumbai",
        nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
        blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    },
    "evmos_testnet": {
        chainId: "0x2328",
        rpcUrls: ["https://eth.bd.evmos.dev:8545"],
        chainName: "Evmos Testnet",
        nativeCurrency: { name: "tEVMOS", decimals: 18, symbol: "tEVMOS" },
        blockExplorerUrls: ["https://evm.evmos.dev"]
    }
}

export const DEPLOYED_CONTRACTS = {
    "polygon_mumbai": {
        TesterCreator: "0x361c8A11a0cc3c257fF09A80C319f956693cD254",
        Credentials: "0x3d30F072Ae6b6E1A6B8Cabd5d4E3b59e60cEEB91"
    }, 
    "evmos_testnet": {
        TesterCreator: "0xa2d155223e10e6E02Ac957C8eF8Cd22B3e731d57",
        Credentials: "0x335FCd03BE4b10227b3384a6fB05B90D21151e46",
    }
}

export const DEPLOYED_CONTRACTS_ON_EXPLORER = {
    "polygon_mumbai": {
        TesterCreator: 'https://mumbai.polygonscan.com/address/' + DEPLOYED_CONTRACTS["polygon_mumbai"].TesterCreator + '#code',
        Credentials: 'https://mumbai.polygonscan.com/address/' + DEPLOYED_CONTRACTS["polygon_mumbai"].Credentials + '#code'
    },
    "evmos_testnet": {
        TesterCreator: 'https://evm.evmos.dev/address/' + DEPLOYED_CONTRACTS["evmos_testnet"].TesterCreator + '/contracts',
        Credentials: 'https://evm.evmos.dev/address/' + DEPLOYED_CONTRACTS["evmos_testnet"].Credentials + '/contracts'
    }
}

export const PROVIDERS = {
    "polygon_mumbai": new ethers.providers.JsonRpcProvider(process.env.REACT_APP_MATIC_QUICKNODE_KEY),
    "evmos_testnet": new ethers.providers.JsonRpcProvider("https://eth.bd.evmos.dev:8545")
}