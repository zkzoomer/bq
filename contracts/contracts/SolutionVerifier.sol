// SPDX-License-Identifier: GPL-3.0
// Generated using circom - https://github.com/iden3/circom
pragma solidity ^0.8.0;

import "./Pairing.sol";

contract Poseidon {
    function poseidon(uint256[2] calldata) public pure returns(uint256) {}
}

contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alfa1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[] IC;
    }
    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }
    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(
            20491192805390485299153009773594534940189261866228447918068658471970481763042,
            9383485363053290200918347156157836566562967994039712273449902621266178545958
        );

        vk.beta2 = Pairing.G2Point(
            [4252822878758300859123897981450591353533073413197771768651442665752259397132,
             6375614351688725206403948262868962793625744043794305715222011528459656738731],
            [21847035105528745403288232691147584728191162732299865338377159692350059136679,
             10505242626370262277552901082094356697409835680220590971873171140371331206856]
        );
        vk.gamma2 = Pairing.G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
        vk.delta2 = Pairing.G2Point(
            [7602112948901834831044283463434762801934412628204073304565858413007645791488,
             16303663887732266940063782365383824235516325954770126204408363023176124776458],
            [8436683573522046417657630149233352146345922232859700051994679566366018181445,
             8281826050350358138535321249067942162961796587417446934857754028865024918753]
        );
        vk.IC = new Pairing.G1Point[](3);
        
        vk.IC[0] = Pairing.G1Point( 
            76172660519332976741619969483087828049439350204697132449996942199557882884,
            7883673951161994563149585610984056246018259588361091206664422423689317072931
        );                                      
        
        vk.IC[1] = Pairing.G1Point( 
            13674399945217494193219387510031666639260899788418334525683107237125482884328,
            355381085764903827783770415669726325959176491481460305019497434690042530757
        );                                      
        
        vk.IC[2] = Pairing.G1Point( 
            14165172995624074502910581365451183748959779017512789184038657596523864392800,
            17554537639900655735045900998621349811846266316730255675385803924206771723966
        );                                      
        
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length,"verifier-bad-input");
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field,"verifier-gte-snark-scalar-field");
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.IC[0]);
        if (!Pairing.pairingProd4(
            Pairing.negate(proof.A), proof.B,
            vk.alfa1, vk.beta2,
            vk_x, vk.gamma2,
            proof.C, vk.delta2
        )) return 1;
        return 0;
    }
    /// @return r  bool true if proof is valid
    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input
        ) internal view returns (bool r) {
        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}

contract SolutionVerifier is Verifier {
    
    // Smart contract for hashing with the Poseidon algorithm
    Poseidon public poseidonHasher;

    constructor (address _poseidonHasher) {
        poseidonHasher = Poseidon(_poseidonHasher);
    }

    /**
     * @dev Verifies that the msg.sender's provided solution solves the given multiple choice test defined by `solutionHash`
     *
     * If the `verifyProof` call returns `true`, we know the msg.sender knows a set of 64 answers that when hashed to form a
     * Merkle tree root, and then hashed to the right with the provided salt `input[1]`, gives the solving hash `input[0]`.
     * Notice how we cannot know which set of 64 answers the user knows -- it never gets recorded in chain thanks to a ZKP
     *
     * To verify if then if this set of answers is the correct one, we can check if the given solving hash `input[0]` is the
     * result of hashing the salt `input[1]` together with the `solutionHash`, which is the Merkle tree root that defines the 
     * solution of the 64 questions
     *
     * If we take the base example of a multiple choice test with 64 questions of 4 possible answers each, there are a total of:
     *                                              4 ** 64 = 3.4028237e+38
     * possible answers to the test, so we can be fairly certain that a user cannot pass a given test unless they know the answers.
     * At the same time, by using zero-knowledge proofs, these answers do not get recorded on chain, so we can also be certain
     * that future users that solve this given test must also know the answers.
     */
    function verifySolution(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[2] calldata input,
        uint256 solutionHash
    ) internal view returns (bool isVerified) {
        isVerified = true;
        if (
            !verifyProof(a, b, c, input)  
            ||
            input[0] != poseidonHasher.poseidon([input[1], solutionHash])  // `input[1]` is the salt -- one-use random number chosen by the user
        ) {
            isVerified = false;
        }
    }
}
