const { expect } = require("chai");
const { ethers, assert } = require("hardhat");
const poseidon = require("./poseidon.js");
const { poseidonContract } =  require("circomlibjs");


describe("Poseidon hashing contract", function () {
    let account
    let poseidon2;
    this.timeout(100000);

    before(async () => {
        [account] = await ethers.getSigners();
    })

    it("Deploys the hashing contracts", async () => {
        const P2 = new ethers.ContractFactory(
            poseidonContract.generateABI(2),
            poseidonContract.createCode(2),
            account
        );

        poseidon2 = await P2.deploy();
    });

    it("Calculates the Poseidon hash correctly", async () => {
        const input = [
            "350"  // salt
            ,
            "3330844108758711782672220159612173083623710937399719017074673646455206473965"  // solution hash
        ]
        const solvingHash = "7822198811452539348280785474626461618515913410713167506810277403996587388862";

        const res2 = await poseidon2["poseidon(uint256[2])"](input);

        const pos2 = poseidon(input);

        assert.equal(res2.toString(), pos2.toString());
        assert.equal(res2.toString(), solvingHash);
    })

})