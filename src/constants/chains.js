export const SupportedChainId = {
    POLYGON_MUMBAI: 80001,
}

export const CHAIN_IDS_TO_NAMES = {
    [SupportedChainId.POLYGON_MUMBAI]: 'polygon_mumbai',
}

export const ALL_SUPPORTED_CHAIN_IDS = Object.values(SupportedChainId)

export const CHAIN_IDS_NETWORK_PARAMETERS = {
    "0x13881": {
        chainId: "0x13881",
        rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
        chainName: "Mumbai",
        nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
        blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    }
}

export const DEPLOYED_CONTRACTS = {
    80001: {
        TesterCreator: "0x361c8A11a0cc3c257fF09A80C319f956693cD254",
        Credentials: "0x3d30F072Ae6b6E1A6B8Cabd5d4E3b59e60cEEB91"
    }
}

export const DEPLOYED_CONTRACTS_ON_EXPLORER = {
    80001: {
        TesterCreator: 'https://mumbai.polygonscan.com/address/' + DEPLOYED_CONTRACTS[80001].TesterCreator + '#code',
        Credentials: 'https://mumbai.polygonscan.com/address/' + DEPLOYED_CONTRACTS[80001].Credentials + '#code'
    }
}