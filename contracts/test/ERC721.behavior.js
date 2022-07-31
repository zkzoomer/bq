const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const { shouldSupportInterfaces } = require('./SupportsInterface.behavior');

const firstTokenId = new BN('1');
const secondTokenId = new BN('2');
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
const proofB = require("../proof/proofB.json");
const publicB = require("../proof/publicB.json");
const solutionB = require("../proof/solutionB.json").solution

function shouldBehaveLikeERC721 (approveRevertMessage, transferRevertMessage, owner, newOwner, solver, altSolver, operator, other) {
  shouldSupportInterfaces([
    'ERC165',
    'ERC721',
  ]);

  context('with minted tokens', function () {
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
    });

    describe('balanceOf', function () {
      context('when the given address owns some tokens', function () {
        it('returns the amount of tokens owned by the given address', async function () {
          expect(await this.testerCreator.balanceOf(owner)).to.be.bignumber.equal('2');
          expect(await this.credentials.balanceOf(solver)).to.be.bignumber.equal('2');
        });
      });

      context('when the given address does not own any tokens', function () {
        it('returns 0', async function () {
          expect(await this.token.balanceOf(other)).to.be.bignumber.equal('0');
        });
      });

      context('when querying the zero address', function () {
        it('throws', async function () {
          await expectRevert(
            this.token.balanceOf(ZERO_ADDRESS), 'ERC721: balance query for the zero address',
          );
        });
      });
    });

    describe('ownerOf', function () {
      context('when the given token ID was tracked by this token', function () {
        const tokenId = firstTokenId;

        it('returns the owner of the given token ID', async function () {
          expect(await this.token.ownerOf(tokenId)).to.be.equal(owner);
        });
      });

      context('when the given token ID was not tracked by this token', function () {
        const tokenId = nonExistentTokenId;

        it('reverts', async function () {
          await expectRevert(
            this.token.ownerOf(tokenId), 'ERC721: owner query for nonexistent token',
          );
        });
      });
    });

    describe('transfers', function () {
      const tokenId = firstTokenId;
      const data = '0x42';

      it('cannot transfer testers', async function () {
        await expectRevert(
            this.token.transferFrom(owner, newOwner, 1, { from: owner })
            ,
            transferRevertMessage
        )
        await expectRevert(
            this.token.safeTransferFrom(owner, newOwner, 1, { from: owner })
            ,
            transferRevertMessage
        )

        // Other callers get the same message
        await expectRevert(
            this.token.transferFrom(owner, newOwner, 1, { from: newOwner })
            ,
            transferRevertMessage
        )
        await expectRevert(
            this.token.safeTransferFrom(owner, newOwner, 1, { from: newOwner })
            ,
            transferRevertMessage
        )
      });

      it('cannot approve another address to transfer tokens', async function () {
          await expectRevert(
              this.token.approve(other, 1, { from: owner })
              ,
              approveRevertMessage
          )
          await expectRevert(
              this.token.setApprovalForAll(other, true, { from: owner })
              ,
              approveRevertMessage
          )

          // Other callers get the same message
          await expectRevert(
              this.token.approve(other, 1, { from: newOwner })
              ,
              approveRevertMessage
          )
          await expectRevert(
              this.token.setApprovalForAll(other, true, { from: newOwner })
              ,
              approveRevertMessage
          )
      })
    });
  });

  describe('getApproved', async function () {
    it('returns the zero address', async function () {
      expect(await this.token.getApproved(firstTokenId)).to.be.equal(
        ZERO_ADDRESS,
      )
    })
  });

  describe('isApprovedForAll', async function () {
    it('returns false', async function () {
      expect(await this.token.isApprovedForAll(owner, operator)).to.be.false
    })
  });
}

function shouldBehaveLikeERC721Enumerable (errorPrefix, owner, newOwner, solver, altSolver, operator, other) {
  shouldSupportInterfaces([
    'ERC721Enumerable',
  ]);

  context('with minted tokens', function () {
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
    });

    describe('totalSupply', function () {
      it('returns total token supply', async function () {
        expect(await this.token.totalSupply()).to.be.bignumber.equal('2');
      });
    });

    describe('tokenOfOwnerByIndex', function () {
      describe('when the given index is lower than the amount of tokens owned by the given address', function () {
        it('returns the token ID placed at the given index', async function () {
          expect(await this.testerCreator.tokenOfOwnerByIndex(owner, 0)).to.be.bignumber.equal(firstTokenId);
        });
      });

      describe('when the index is greater than or equal to the total tokens owned by the given address', function () {
        it('reverts', async function () {
          await expectRevert(
            this.testerCreator.tokenOfOwnerByIndex(owner, 2), 'Index out of bounds',
          );
        });
      });

      describe('when the given address does not own any token', function () {
        it('reverts', async function () {
          await expectRevert(
            this.testerCreator.tokenOfOwnerByIndex(other, 0), 'Index out of bounds',
          );
        });
      });

    });

    describe('tokenByIndex', function () {
      it('returns all tokens', async function () {
        const tokensListed = await Promise.all(
          [0, 1].map(i => this.token.tokenByIndex(i)),
        );
        expect(tokensListed.map(t => t.toNumber())).to.have.members([firstTokenId.toNumber(),
          secondTokenId.toNumber()]);
      });

      it('reverts if index is greater than supply', async function () {
        await expectRevert(
          this.testerCreator.tokenByIndex(2), 'Index out of bounds',
        );
      });

    });
  });

}

function shouldBehaveLikeERC721Metadata (errorPrefix, name, symbol, owner) {
  shouldSupportInterfaces([
    'ERC721Metadata',
  ]);

  describe('metadata', function () {
    it('has a name', async function () {
      expect(await this.token.name()).to.be.equal(name);
    });

    it('has a symbol', async function () {
      expect(await this.token.symbol()).to.be.equal(symbol);
    });

    describe('token URI', function () {
      beforeEach(async function () {
        await this.testerCreator.createTester(
          testerURI, solutionHash, timeLimit, credentialLimit, requiredPass, credentialsGained,
          { from: owner, value: prize }
        );
      });

      it('return the given URI', async function () {
        expect(await this.token.tokenURI(firstTokenId)).to.be.equal(testerURI);
      });

      it('reverts when queried for non existent token id', async function () {
        await expectRevert(
          this.token.tokenURI(nonExistentTokenId), 'Tester does not exist',
        );
      });

    });
  });
}

module.exports = {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Enumerable,
  shouldBehaveLikeERC721Metadata,
};