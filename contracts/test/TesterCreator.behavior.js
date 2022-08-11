const { BN, constants, time, expectEvent, expectRevert, balance } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const firstTokenId = new BN('1');
const secondTokenId = new BN('2');
const thirdTokenId = new BN('3');
const nonExistentTokenId = new BN('10');

const testerURI = 'https://exampletester.io';
const solutionHash = '10483540708739576660440356112223782712680507694971046950485797346645134034053';
const altSolutionHash = '376708155208532431192009293373440944809805944505313670183499188700119115952';
const timeLimit = "4294967295";
const credentialLimit = "4294967295";
const requiredPass = ZERO_ADDRESS;
const credentialsGained = 'Test verified';
const prize = web3.utils.toWei('1', 'ether');
const emptyPrize = web3.utils.toWei('0', )

const proofA = require("../proof/proofA.json");
const publicA = require("../proof/publicA.json");
const solutionA = require("../proof/solutionA.json").solution
const altProofA = require("../proof/altProofA.json");
const altPublicA = require("../proof/altPublicA.json");
const proofB = require("../proof/proofB.json");
const publicB = require("../proof/publicB.json");
const solutionB = require("../proof/solutionB.json").solution
const altProofB = require("../proof/altProofB.json");
const altPublicB = require("../proof/altPublicB.json");

function shouldBehaveLikeTesterCreator(owner, newOwner, solver, altSolver, operator, other) {
    context('without created tests', function () {
        describe('createTester', function () {
            context('when the time limit is less than the current time', function () {
                it('reverts', async function () {
                    const pastTime = Math.floor(Date.now() / 1000) - 10;
                    await expectRevert(
                        this.testerCreator.createTester(
                            testerURI, solutionHash, pastTime, credentialLimit, requiredPass, credentialsGained,
                            { from: owner, value: prize }
                        )
                        ,
                        "Time limit is in the past"   
                    )
                })
            })

            context('when the credential limit is equal to zero', function () {
                it('reverts', async function () {
                    await expectRevert(
                        this.testerCreator.createTester(
                            testerURI, solutionHash, timeLimit, 0, requiredPass, credentialsGained,
                            { from: owner, value: prize }
                        )
                        ,
                        "Credential limit must be above zero"   
                    )
                })
            })

            context('when providing a malicious contract as the required pass', function () {
                it('reverts', async function () {
                    await expectRevert.unspecified(
                        this.testerCreator.createTester(
                            testerURI, solutionHash, timeLimit, credentialLimit, this.malicious.address, credentialsGained,
                            { from: owner, value: prize }
                        )
                    )
                })
            })

            context('when providing a valid contract as the required pass', function () {
                it('mints a new tester', async function () {
                    // tx clears
                    await this.testerCreator.createTester(
                        testerURI, solutionHash, timeLimit, credentialLimit, this.valid.address, credentialsGained,
                        { from: owner, value: prize }
                    );
                })
            })

            context('after a succesful mint (tester creation)', function () {
                let tx

                beforeEach(async function () {
                    tx = await this.testerCreator.createTester(
                        testerURI, solutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
                        { from: owner, value: prize }
                    );
                })

                it('emits a transfer event', async function () {
                    expectEvent(tx, 'Transfer', { from: ZERO_ADDRESS, to: owner, tokenId: '1' })
                })
            })
        })

        describe('getTester', function () {
            context('when the given testerId does not exist', function () {
                it('reverts', async function () {
                    await expectRevert(
                        this.testerCreator.getTester(nonExistentTokenId)
                        ,
                        "Tester does not exist"
                    )
                })
            })

            context('after minting a given testerId', function () {
                let onChainTester = [
                    solutionHash,
                    prize,
                    '0',
                    timeLimit,
                    credentialLimit,
                    requiredPass,
                    credentialsGained
                ]

                this.beforeEach(async function () {
                    await this.testerCreator.createTester(
                        testerURI, solutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
                        { from: owner, value: prize }
                    );
                })

                it('returns the given on chain tester for this testerId', async function () {
                    expect((await this.testerCreator.getTester(firstTokenId)).slice(0,7).map(n => { return n.toString() }))
                        .to.deep.equal(onChainTester)
                })
            })
        })

        describe('testerExists', function () {
            context('when the given testerId does not exist', function () {
                it('returns false', async function () {
                    expect(await this.testerCreator.testerExists(nonExistentTokenId))
                        .to.be.false
                })
            })

            context('after minting a given testerId', function () {
                beforeEach(async function () {
                    await this.testerCreator.createTester(
                        testerURI, solutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
                        { from: owner, value: prize }
                    );
                })

                it('returns true', async function () {
                    expect(await this.testerCreator.testerExists(firstTokenId))
                        .to.be.true
                })
            })
        })
    })

    context('with created tests', function () {
        beforeEach(async function () {
            await this.testerCreator.createTester(
                testerURI, solutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
                { from: owner, value: prize }
            );
            await this.testerCreator.createTester(
                testerURI, altSolutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
                { from: owner, value: prize }
            );
        })

        describe('deleteTester', function () {
            context('when deleting a nonexistent tester', function () {
                it('reverts', async function () {
                    await expectRevert(
                        this.testerCreator.deleteTester(nonExistentTokenId, { from: owner })
                        ,
                        "Tester does not exist"
                    )
                })
            })

            context('when deleting a token that is not own', function () {
                it('reverts', async function () {
                    await expectRevert(
                        this.testerCreator.deleteTester(firstTokenId, { from: newOwner })
                        ,
                        "Deleting tester that is not own"
                    )
                })
            })

            context('with a successful deletion', function () {
                let tx

                beforeEach(async function () {
                    tx = await this.testerCreator.deleteTester(firstTokenId, { from: owner })
                })

                it('burns the token from the owner\'s holdings and total supply', async function () {
                    expect(await this.testerCreator.balanceOf(owner)).to.be.bignumber.equal('1')
                    expect(await this.testerCreator.totalSupply()).to.be.bignumber.equal('1')  // Total supply and owner holdings are now 1
                    expect(await this.testerCreator.tokenByIndex('0')).to.be.bignumber.equal('2')  // First token is now testerId #2
                    expect(await this.testerCreator.tokenOfOwnerByIndex(owner, '0')).to.be.bignumber.equal('2')
                    await expectRevert(
                        this.testerCreator.ownerOf(firstTokenId)
                        ,
                        "ERC721: owner query for nonexistent token"
                    )
                    await expectRevert(
                        this.testerCreator.tokenByIndex('1')
                        ,
                        "Index out of bounds"
                    )
                    await expectRevert(
                        this.testerCreator.tokenOfOwnerByIndex(owner, '1')
                        ,
                        "Index out of bounds"
                    )
                })

                it('deletes the URI', async function () {
                    await expectRevert(
                        this.testerCreator.tokenURI('1')
                        ,
                        "Tester does not exist"
                    )
                })

                it('deletes the on chain tester object', async function () {
                    await expectRevert(
                        this.testerCreator.getTester('1')
                        ,
                        "Tester does not exist"
                    )
                })

                it('sends the funds back if the tester was never solved', async function () {
                    let startBalance = BigInt(await web3.eth.getBalance(owner))

                    let txDict = await this.testerCreator.deleteTester(secondTokenId, { from: owner })
                    let txFee = BigInt(txDict.receipt.gasUsed.toString()) * BigInt(txDict.receipt.effectiveGasPrice.toString())

                    let endBalance = BigInt(await web3.eth.getBalance(owner))

                    const balanceGain = endBalance - startBalance
                    const expectedGain = BigInt(prize) - txFee

                    expect(balanceGain).to.be.equal(expectedGain)
                })
                
                it('does not send any funds back if the tester did not include a prize', async function () {
                    await this.testerCreator.createTester(
                        testerURI, altSolutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
                        { from: owner, value: emptyPrize }
                    );

                    let startBalance = BigInt(await web3.eth.getBalance(owner))

                    let txDict = await this.testerCreator.deleteTester(thirdTokenId, { from: owner })
                    let txFee = BigInt(txDict.receipt.gasUsed.toString()) * BigInt(txDict.receipt.effectiveGasPrice.toString())

                    let endBalance = BigInt(await web3.eth.getBalance(owner))
                    
                    const balanceGain = endBalance - startBalance
                    const expectedGain = - txFee

                    expect(balanceGain).to.be.equal(expectedGain)
                    
                })

                it('does not send any funds back if the tester was solved once', async function () {
                    let startBalance = BigInt(await web3.eth.getBalance(owner))

                    await this.testerCreator.solveTester(
                        secondTokenId,
                        [proofB.pi_a[0], proofB.pi_a[1]],
                        [[proofB.pi_b[0][1], proofB.pi_b[0][0]], [proofB.pi_b[1][1], proofB.pi_b[1][0]]],
                        [proofB.pi_c[0], proofB.pi_c[1]],
                        publicB,
                        { from: solver }
                    )
                    let txDict = await this.testerCreator.deleteTester(secondTokenId, { from: owner })
                    
                    let txFee = BigInt(txDict.receipt.gasUsed.toString()) * BigInt(txDict.receipt.effectiveGasPrice.toString())

                    let endBalance = BigInt(await web3.eth.getBalance(owner))

                    const balanceGain = endBalance - startBalance
                    const expectedGain = - txFee

                    expect(balanceGain).to.be.equal(expectedGain)
                })

                it('emits a transfer event', async function () {
                    expectEvent(tx, 'Transfer', { from: owner, to: ZERO_ADDRESS, tokenId: firstTokenId})
                })
            })
        })

        describe('solveTester', function () {
            context('when the given testerId does not exist', function () {
                it('reverts', async function () {
                    await expectRevert(
                        this.testerCreator.solveTester(
                            nonExistentTokenId,
                            [proofA.pi_a[0], proofA.pi_a[1]],
                            [[proofA.pi_b[0][1], proofA.pi_b[0][0]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                            [proofA.pi_c[0], proofA.pi_c[1]],
                            publicA,
                            { from: solver }
                        )
                        ,
                        "Solving test that does not exist"
                    )
                })
            })

            context('when the given salt was already used', function () {
                beforeEach(async function () {
                    await this.testerCreator.solveTester(
                        firstTokenId,
                        [proofA.pi_a[0], proofA.pi_a[1]],
                        [[proofA.pi_b[0][1], proofA.pi_b[0][0]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                        [proofA.pi_c[0], proofA.pi_c[1]],
                        publicA,
                        { from: solver }
                    )
                })

                it('reverts', async function () {
                    await expectRevert(
                        this.testerCreator.solveTester(
                            firstTokenId,
                            [proofA.pi_a[0], proofA.pi_a[1]],
                            [[proofA.pi_b[0][1], proofA.pi_b[0][0]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                            [proofA.pi_c[0], proofA.pi_c[1]],
                            publicA,
                            { from: altSolver }
                        )
                        ,
                        "Salt was already used"
                    )
                })
            })

            context('when the owner tries to solve the tester', function () {
                it('reverts', async function () {
                    await expectRevert(
                        this.testerCreator.solveTester(
                            firstTokenId,
                            [proofA.pi_a[0], proofA.pi_a[1]],
                            [[proofA.pi_b[0][1], proofA.pi_b[0][0]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                            [proofA.pi_c[0], proofA.pi_c[1]],
                            publicA,
                            { from: owner }
                        )
                        ,
                        "Tester cannot be solved by owner"
                    )
                })
            })

            context('when the number of credentials have been reached', function () {
                beforeEach(async function () {
                    await this.testerCreator.createTester(
                        testerURI, solutionHash, timeLimit, '1', requiredPass, credentialsGained,
                        { from: owner, value: prize }
                    );

                    await this.testerCreator.solveTester(
                        thirdTokenId,
                        [proofA.pi_a[0], proofA.pi_a[1]],
                        [[proofA.pi_b[0][1], proofA.pi_b[0][0]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                        [proofA.pi_c[0], proofA.pi_c[1]],
                        publicA,
                        { from: solver }
                    )
                })
                
                it('reverts', async function () {
                    await expectRevert(
                        this.testerCreator.solveTester(
                            thirdTokenId,
                            [altProofA.pi_a[0], altProofA.pi_a[1]],
                            [[altProofA.pi_b[0][1], altProofA.pi_b[0][0]], [altProofA.pi_b[1][1], altProofA.pi_b[1][0]]],
                            [altProofA.pi_c[0], altProofA.pi_c[1]],
                            altPublicA,
                            { from: altSolver }
                        )
                        ,
                        "Maximum number of credentials reached"
                    )
                })
            })

            context('when the time limit has been reached', function () {
                beforeEach(async function () {
                    const blockNum = await web3.eth.getBlockNumber()
                    const block = await web3.eth.getBlock(blockNum)
                    const nearTimeLimit = block['timestamp'] + 100;
                    await this.testerCreator.createTester(
                        testerURI, solutionHash, nearTimeLimit, credentialLimit, requiredPass, credentialsGained,
                        { from: owner, value: prize }
                    );

                    // can solve now
                    await this.testerCreator.solveTester(
                        thirdTokenId,
                        [proofA.pi_a[0], proofA.pi_a[1]],
                        [[proofA.pi_b[0][1], proofA.pi_b[0][0]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                        [proofA.pi_c[0], proofA.pi_c[1]],
                        publicA,
                        { from: solver }
                    )
                })
                
                it('reverts', async function () {
                    // but not later
                    await time.increase(time.duration.seconds(101));
                    await expectRevert(
                        this.testerCreator.solveTester(
                            thirdTokenId,
                            [altProofA.pi_a[0], altProofA.pi_a[1]],
                            [[altProofA.pi_b[0][1], altProofA.pi_b[0][0]], [altProofA.pi_b[1][1], altProofA.pi_b[1][0]]],
                            [altProofA.pi_c[0], altProofA.pi_c[1]],
                            altPublicA,
                            { from: altSolver }
                        )
                        ,
                        "Time limit for this credential reached"
                    )
                })
            })

            context('when giving an invalid proof', function () {
                it('reverts', async function () {
                    await expectRevert(
                        this.testerCreator.solveTester(
                            firstTokenId,
                            [proofA.pi_a[0], proofA.pi_a[1]],
                            [[proofA.pi_b[0][0], proofA.pi_b[0][1]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                            [proofA.pi_c[0], proofA.pi_c[1]],
                            publicA,
                            { from: solver }
                        )
                        ,
                        "invalid opcode"
                    )
                })
            })

            context('when verification is not successful', function () {
                let onChainTester = [
                    solutionHash,
                    prize,
                    '0',
                    timeLimit,
                    credentialLimit,
                    requiredPass,
                    credentialsGained
                ]

                it('reverts', async function () {
                    await expectRevert(
                        this.testerCreator.solveTester.call(
                            firstTokenId,
                            [altProofB.pi_a[0], altProofB.pi_a[1]],
                            [[altProofB.pi_b[0][1], altProofB.pi_b[0][0]], [altProofB.pi_b[1][1], altProofB.pi_b[1][0]]],
                            [altProofB.pi_c[0], altProofB.pi_c[1]],
                            altPublicB,
                            { from: altSolver }
                        )
                        ,
                        'Invalid solution'
                    )
                })

                it('does not alter the on chain tester object', async function () {
                    expect((await this.testerCreator.getTester(firstTokenId)).slice(0,7).map(n => { return n.toString() }))
                        .to.deep.equal(onChainTester)
                })
            })

            context('when the caller does not own the required pass', function () {
                beforeEach(async function () {
                    await this.testerCreator.createTester(
                        testerURI, altSolutionHash, timeLimit, credentialLimit, this.valid.address, credentialsGained,
                        { from: owner, value: prize }
                    );
                })

                it('reverts', async function () {
                    await expectRevert(
                        this.testerCreator.solveTester(
                            thirdTokenId,
                            [proofA.pi_a[0], proofA.pi_a[1]],
                            [[proofA.pi_b[0][1], proofA.pi_b[0][0]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                            [proofA.pi_c[0], proofA.pi_c[1]],
                            publicA,
                            { from: solver }
                        )
                        ,
                        "Solver does not own the required token"
                    )
                })
            })

            context('when the caller owns the required pass', function () {
                beforeEach(async function () {
                    await this.testerCreator.createTester(
                        testerURI, altSolutionHash, timeLimit, credentialLimit, this.valid.address, credentialsGained,
                        { from: owner, value: prize }
                    );

                    await this.valid.mint(solver, firstTokenId)
                })

                it('solves the tester', async function () {
                    // solving tx clears
                    await this.testerCreator.solveTester.call(
                        firstTokenId,
                        [proofA.pi_a[0], proofA.pi_a[1]],
                        [[proofA.pi_b[0][1], proofA.pi_b[0][0]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                        [proofA.pi_c[0], proofA.pi_c[1]],
                        publicA,
                        { from: solver }
                    )
                })
            })

            context('when verification is successful', function () {
                let tx
                let onChainTester = [
                    solutionHash,
                    prize,
                    '1',
                    timeLimit,
                    credentialLimit,
                    requiredPass,
                    credentialsGained
                ]

                beforeEach(async function () {
                    tx = await this.testerCreator.solveTester(
                        firstTokenId,
                        [proofA.pi_a[0], proofA.pi_a[1]],
                        [[proofA.pi_b[0][1], proofA.pi_b[0][0]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                        [proofA.pi_c[0], proofA.pi_c[1]],
                        publicA,
                        { from: solver }
                    )
                })

                it('returns true', async function () {
                    // tx clears
                    await this.testerCreator.solveTester.call(
                        firstTokenId,
                        [altProofA.pi_a[0], altProofA.pi_a[1]],
                        [[altProofA.pi_b[0][1], altProofA.pi_b[0][0]], [altProofA.pi_b[1][1], altProofA.pi_b[1][0]]],
                        [altProofA.pi_c[0], altProofA.pi_c[1]],
                        altPublicA,
                        { from: altSolver }
                    )
                })

                it('updates the on chain tester object', async function () {
                    expect((await this.testerCreator.getTester(firstTokenId)).slice(0,7).map(n => { return n.toString() }))
                        .to.deep.equal(onChainTester)
                })

                it('pays the first solver but not the following ones', async function () {
                    let startBalance = BigInt(await web3.eth.getBalance(solver))

                    let txDict = await this.testerCreator.solveTester(
                        secondTokenId,
                        [proofB.pi_a[0], proofB.pi_a[1]],
                        [[proofB.pi_b[0][1], proofB.pi_b[0][0]], [proofB.pi_b[1][1], proofB.pi_b[1][0]]],
                        [proofB.pi_c[0], proofB.pi_c[1]],
                        publicB,
                        { from: solver }
                    )
                    let txFee = BigInt(txDict.receipt.gasUsed.toString()) * BigInt(txDict.receipt.effectiveGasPrice.toString())

                    let endBalance = BigInt(await web3.eth.getBalance(solver))

                    const balanceGain = endBalance - startBalance
                    const expectedGain = BigInt(prize) - txFee

                    expect(balanceGain).to.be.equal(expectedGain)

                    // Second solver
                    let altStartBalance = BigInt(await web3.eth.getBalance(altSolver))

                    let altTxDict = await this.testerCreator.solveTester(
                        secondTokenId,
                        [altProofB.pi_a[0], altProofB.pi_a[1]],
                        [[altProofB.pi_b[0][1], altProofB.pi_b[0][0]], [altProofB.pi_b[1][1], altProofB.pi_b[1][0]]],
                        [altProofB.pi_c[0], altProofB.pi_c[1]],
                        altPublicB,
                        { from: altSolver }
                    )
                    let altTxFee = BigInt(altTxDict.receipt.gasUsed.toString()) * BigInt(altTxDict.receipt.effectiveGasPrice.toString())

                    let altEndBalance = BigInt(await web3.eth.getBalance(altSolver))

                    const altBalanceGain = altEndBalance - altStartBalance
                    const altExpectedGain = - altTxFee

                    expect(altExpectedGain).to.be.equal(altBalanceGain)
                })

                it('does not pay the solver if no prize was specified', async function () {

                    await this.testerCreator.createTester(
                        testerURI, solutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
                        { from: owner, value: emptyPrize }
                    );
                    
                    let startBalance = BigInt(await web3.eth.getBalance(altSolver))

                    let txDict = await this.testerCreator.solveTester(
                        thirdTokenId,
                        [altProofA.pi_a[0], altProofA.pi_a[1]],
                        [[altProofA.pi_b[0][1], altProofA.pi_b[0][0]], [altProofA.pi_b[1][1], altProofA.pi_b[1][0]]],
                        [altProofA.pi_c[0], altProofA.pi_c[1]],
                        altPublicA,
                        { from: altSolver }
                    )
                    let txFee = BigInt(txDict.receipt.gasUsed.toString()) * BigInt(txDict.receipt.effectiveGasPrice.toString())

                    let endBalance = BigInt(await web3.eth.getBalance(altSolver))

                    const balanceGain = endBalance - startBalance
                    const expectedGain = - txFee

                    expect(balanceGain).to.be.equal(expectedGain)
                })

                it('mints a new credential NFT for the solver', async function () {
                    expect(await this.credentials.balanceOf(solver))
                        .to.be.bignumber.equal('1')
                })

                it('emits a transfer event for the credential', async function () {
                    expectEvent(tx, 'Transfer', { from: this.testerCreator.address, to: solver, tokenId: firstTokenId })
                })

                context('when solver already gained credentials', function () {
                    it('reverts', async function () {
                        await expectRevert(
                            this.testerCreator.solveTester(
                                firstTokenId,
                                [altProofA.pi_a[0], altProofA.pi_a[1]],
                                [[altProofA.pi_b[0][1], altProofA.pi_b[0][0]], [altProofA.pi_b[1][1], altProofA.pi_b[1][0]]],
                                [altProofA.pi_c[0], altProofA.pi_c[1]],
                                altPublicA,
                                { from: solver }
                            )
                            ,
                            "Solver already gained credentials"
                        )
                    })
                })
            })
        })
    })
}

module.exports = {
    shouldBehaveLikeTesterCreator
};