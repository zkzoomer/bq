const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
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

function shouldBehaveLikeCredentials(owner, newOwner, solver, altSolver, operator, other) {
    context('with solved testers', function () {
        beforeEach(async function () {
            await this.testerCreator.createTester(
                testerURI, solutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
                { from: owner, value: prize }
            );
            await this.testerCreator.createTester(
                testerURI, altSolutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
                { from: owner, value: prize }
            );
        
            // Solving these testers
            await this.testerCreator.solveTester(
                firstTokenId,
                [proofA.pi_a[0], proofA.pi_a[1]],
                [[proofA.pi_b[0][1], proofA.pi_b[0][0]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                [proofA.pi_c[0], proofA.pi_c[1]],
                publicA,
                { from: solver }
            )
            await this.testerCreator.solveTester(
                secondTokenId,
                [proofB.pi_a[0], proofB.pi_a[1]],
                [[proofB.pi_b[0][1], proofB.pi_b[0][0]], [proofB.pi_b[1][1], proofB.pi_b[1][0]]],
                [proofB.pi_c[0], proofB.pi_c[1]],
                publicB,
                { from: solver }
            )
        })

        describe('totalSupply', function () {
            it('increases with other users solving the tester', async function () {
                expect(await this.credentials.totalSupply())
                    .to.be.bignumber.equal('2')

                await this.testerCreator.solveTester(
                    firstTokenId,
                    [altProofA.pi_a[0], altProofA.pi_a[1]],
                    [[altProofA.pi_b[0][1], altProofA.pi_b[0][0]], [altProofA.pi_b[1][1], altProofA.pi_b[1][0]]],
                    [altProofA.pi_c[0], altProofA.pi_c[1]],
                    altPublicA,
                    { from: altSolver }
                )

                expect(await this.credentials.totalSupply())
                    .to.be.bignumber.equal('3')
            })
        })

        describe('credentialReceivers', function () {
            context('when the credentials have not been granted yet', function () {
                it('returns an empty list', async function () {
                    expect(await this.credentials.credentialReceivers(thirdTokenId)).to.deep.equal([])
                })
            })

            context('when the credentials have been granted', function () {
                it('returns a list of the addresses that got a credential', async function () {
                    await this.testerCreator.solveTester(
                        firstTokenId,
                        [altProofA.pi_a[0], altProofA.pi_a[1]],
                        [[altProofA.pi_b[0][1], altProofA.pi_b[0][0]], [altProofA.pi_b[1][1], altProofA.pi_b[1][0]]],
                        [altProofA.pi_c[0], altProofA.pi_c[1]],
                        altPublicA,
                        { from: altSolver }
                    )
    
                    expect(await this.credentials.credentialReceivers(firstTokenId))
                        .to.deep.equal([solver, altSolver])
                })
            })
        })

        describe('receivedCredentials', function () {
            context('when the address did not receive any credentials', function () {
                it('returns an empty list', async function () {
                    expect(await this.credentials.receivedCredentials(altSolver)).to.deep.equal([])
                })
            })

            context('when the address did receive some credentials', function () {
                it('returns the list of credentials it received', async function () {
                    expect((await this.credentials.receivedCredentials(solver)).map(n => { return n.toString() }))
                        .to.deep.equal(['1', '2'])
                })
            })
        })

        describe('getCredential', function () {
            context('when given a nonexistent tester', function () {
                it('reverts', async function () {
                    await expectRevert(
                        this.credentials.getCredential(nonExistentTokenId)
                        ,
                        "Tester does not exist"
                    )
                })
            })

            context('when given a valid tester', function () {
                it('returns the defined credential', async function () {
                    expect(await this.credentials.getCredential(firstTokenId))
                        .to.be.equal(credentialsGained)
                })
            })
        })
    })

    context('with deleted testers', function () {
        beforeEach(async function () {
            await this.testerCreator.createTester(
                testerURI, solutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
                { from: owner, value: prize }
            );
            await this.testerCreator.createTester(
                testerURI, altSolutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
                { from: owner, value: prize }
            );
        
            // Solving these testers
            await this.testerCreator.solveTester(
                firstTokenId,
                [proofA.pi_a[0], proofA.pi_a[1]],
                [[proofA.pi_b[0][1], proofA.pi_b[0][0]], [proofA.pi_b[1][1], proofA.pi_b[1][0]]],
                [proofA.pi_c[0], proofA.pi_c[1]],
                publicA,
                { from: solver }
            )
            await this.testerCreator.solveTester(
                secondTokenId,
                [proofB.pi_a[0], proofB.pi_a[1]],
                [[proofB.pi_b[0][1], proofB.pi_b[0][0]], [proofB.pi_b[1][1], proofB.pi_b[1][0]]],
                [proofB.pi_c[0], proofB.pi_c[1]],
                publicB,
                { from: solver }
            )
            await this.testerCreator.solveTester(
                firstTokenId,
                [altProofA.pi_a[0], altProofA.pi_a[1]],
                [[altProofA.pi_b[0][1], altProofA.pi_b[0][0]], [altProofA.pi_b[1][1], altProofA.pi_b[1][0]]],
                [altProofA.pi_c[0], altProofA.pi_c[1]],
                altPublicA,
                { from: altSolver }
            )

            this.testerCreator.deleteTester(firstTokenId, { from: owner })
        })

        describe('totalSupply', function () {
            it('returns the number of valid credentials that were given', async function () {
                expect(await this.credentials.totalSupply())
                    .to.be.bignumber.equal('1')
            })
        })

        describe('credentialReceivers', function () {
            it('returns a list of the addresses that got the deleted credential', async function () {
                expect(await this.credentials.credentialReceivers(firstTokenId))
                    .to.deep.equal([solver, altSolver])
            })
        })

        describe('receivedCredentials', function () {
            it('returns a list of the tokens an address received, including the deleted credential', async function () {
                expect((await this.credentials.receivedCredentials(solver)).map(n => { return n.toString() }))
                    .to.deep.equal(['1', '2'])
            })
        })

        describe('getCredential', function () {
            it('reverts', async function () {
                it('reverts', async function () {
                    await expectRevert(
                        this.credentials.getCredential(firstTokenId)
                        ,
                        "Tester does not exist"
                    )
                })
            })
        })
    })
}

module.exports = {
    shouldBehaveLikeCredentials
}