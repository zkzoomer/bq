const { ethers, artifacts } = require("hardhat");
const { poseidonContract } =  require("circomlibjs");
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log("Deploying contracts with the account:", deployer.address);
	console.log("Account balance:", (await deployer.getBalance()).toString());

  const P2 = new ethers.ContractFactory(
    poseidonContract.generateABI(2),
    poseidonContract.createCode(2),
    deployer
  )

  const poseidon = await P2.deploy()

  console.log("Deployed Poseidon hashing contract at: ", poseidon.address)

  const TesterCreator = artifacts.require('TesterCreator')
  const testerCreator = await TesterCreator.new(poseidon.address)

  console.log("Deployed TesterCreator contract at: ", testerCreator.address)
  
  const credentials = await testerCreator.credentialsContract()

  console.log("TesterCreator deployed Credentials contract at: ", credentials)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});