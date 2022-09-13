require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-truffle5');
require('hardhat-contract-sizer');
require('hardhat-gas-reporter');

const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai_testnet: {
      url: 'https://rpc-mumbai.maticvigil.com',  // RPC used just for deploying
      accounts: {
        mnemonic: mnemonic
      }
    },
    evmos_testnet: {
      url: 'https://eth.bd.evmos.dev:8545	',  // RPC used just for deploying
      accounts: {
        mnemonic: mnemonic
      }
    }
  },
  gasReporter: {
    enabled: true,
    token: 'MATIC',
    currency: 'USD',
    coinmarketcap: '7b5edf80-0e66-464e-81f2-a07fcc725a4b',  // Keys in production 🤯?????
    gasPrice: 1000,  // Absolute worst case scenario sizing
  },
};
