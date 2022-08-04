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
        TesterCreator: "0x2982B69159753d65Cea1D1D8E2E11C6C17698420",
        Credentials: "0xdf1624d85d8a037e2e4d4ee7da38229eea61b544"
    }
}