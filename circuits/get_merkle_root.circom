pragma circom 2.0.0;

include "./hasher.circom";

// Gets the root of a given Merkle tree, where k is its depth
template GetMerkleRoot(k) {
    // A tree of depth k has a total of 2**k leaves in it
    var nLeaves = 2**k;
    
    // Directly above these 2**k leaves there are 2**k / 2 = 2**(k - 1) nodes
    // These are the number of components that will be used to hash just the leaves
    var nLeafHashers = nLeaves / 2;

    // Above these mentioned nodes we will have a total of 2**k / 2 - 1 nodes
    // These are the number of components that will be used to hash the outputs of the nodes above
    var nNodeHashers = nLeaves / 2 - 1;

    // Leaves to hash
    signal input leaves[nLeaves];
    // Resulting root
    signal output root;

    // The total number of hashers needed will be nLeafHashers + nNodeHashers = nLeaves - 1
    var nHashers = nLeaves - 1;
    component hashers[nHashers];

    // Define all hashers
    for (var i = 0; i < nHashers; i++) {
        hashers[i] = HashLeftRight();
    }

    // Initialize all of the leaf values for the leaf hashers
    for (var i = 0; i < nLeafHashers; i++) {
        hashers[i].left <== leaves[2*i];
        hashers[i].right <== leaves[2*i + 1];
    }

    // Hash the outputs again until arriving at the root
    var j = 0;
    for (var i = nLeafHashers; i < nLeafHashers + nNodeHashers; i++) {
        hashers[i].left <== hashers[j*2].digest;
        hashers[i].right <== hashers[j*2 + 1].digest;
        j++;
    }

    // Output of the final hash is our tree root
    root <== hashers[nHashers - 1].digest;
}