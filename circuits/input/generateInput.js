const fs = require("fs");
const poseidon = require("./poseidon.js");
const poseidonMerkle = require('./poseidonMerkle.js');

// Example response: A, B, C, D
const leafArray = Array.from({length: 64}, (_, i) => 4)

const tree = poseidonMerkle.treeFromLeafArray(leafArray)
console.log(tree[0][0])
// ROOT A: 10483540708739576660440356112223782712680507694971046950485797346645134034053
// ROOT B: 376708155208532431192009293373440944809805944505313670183499188700119115952

const salt = "50"

const inputs = {
    answers: leafArray,
    salt: salt
}

fs.writeFileSync(
    "input.json",
    JSON.stringify(inputs, (key, value) => 
        typeof value === 'bigint'
            ? value.toString() 
            : value // return everything else unchanged
    ),
    "utf-8"
);