const { ethers, artifacts } = require("hardhat");
const { poseidonContract } =  require("circomlibjs");
const {
    shouldBehaveLikeERC721,
    shouldBehaveLikeERC721Metadata,
    shouldBehaveLikeERC721Enumerable,
} = require('./ERC721.behavior');
const { shouldBehaveLikeCredentials } = require('./Credentials.behavior')

const TesterCreator = artifacts.require('TesterCreator')
const Credentials = artifacts.require('Credentials')
let poseidon

contract('Credentials', function (accounts) {
    const name = "Block Qualified Credentials"
    const symbol = "BQC"
    const approveRevertMessage = "BQC: cannot approve credentials"
    const transferRevertMessage = "BQC: cannot transfer credentials"

    beforeEach(async function () {
        [account] = await ethers.getSigners();

        const P2 = new ethers.ContractFactory(
            poseidonContract.generateABI(2),
            poseidonContract.createCode(2),
            account
        )

        poseidon = await P2.deploy()
        this.testerCreator = await TesterCreator.new(poseidon.address)
        const _credentials = await this.testerCreator.credentialsContract()
        /* this.credentials = (new ethers.Contract(_credentials, credentialsAbi)).deployed() */
        this.credentials = await Credentials.at(_credentials)

        this.token = this.credentials
    })

    shouldBehaveLikeERC721(approveRevertMessage, transferRevertMessage, ...accounts);
    shouldBehaveLikeERC721Metadata('ERC721', name, symbol, ...accounts);
    shouldBehaveLikeERC721Enumerable('ERC721', ...accounts)
    shouldBehaveLikeCredentials(...accounts)
})