pragma circom 2.0.0;

include "./hasher.circom";
include "./get_merkle_root.circom";

template VerifyAnswers(k) {
    // A tree of height k has 2**k leaves in it, these are the total number of questions the test has
    var nQuestions = 2**k;

    // Ansers given by the user, as an array of integers that are mapped with the multiple choices
    // EG: A --> 1, B --> 2, C --> 3, D --> 4, ...
    signal input answers[nQuestions];
    // Random number inputted by the user to avoid attackers replicating valid verification transactions
    // Must be stored and voided inside the smart contract once used
    signal input salt;
    // Result of hashing the salt and the solutionHash together, verified inside the smart contract
    signal output verifyingHash;

    // Corresponds to the Merkle root of putting these answers into a tree, the given user's proposed solution
    // The real solving hash is stored in the smart contract, result of the actual solution
    component merkleRoot = GetMerkleRoot(k);
    for (var i = 0; i < nQuestions; i++) {
        merkleRoot.leaves[i] <== answers[i];
    }

    // Using the salt and the computed Merkle root to get our verifying hash
    component verifyingHasher = HashLeftRight();
    verifyingHasher.left <== salt;
    verifyingHasher.right <== merkleRoot.root;

    // This verifying hash will be checked inside the smart contract to see if it is valid
    // This is done by requiring it be equal to hash(salt, verifyingHash)
    // Since the salt is a public input to the proof, and the verifyingHash is stored on chain
    verifyingHash <== verifyingHasher.digest;
}

// Answer verifier for a maximum of 64 multiple choice questions
component main {public [salt]} = VerifyAnswers(6);