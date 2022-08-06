import { poseidon } from "./poseidon";

function treeFromLeafArray (leafArray) {
    const depth = getBase2Log(leafArray.length);
    const tree = Array(depth);
    tree[depth - 1] = pairwiseHash(leafArray)
    for (var j = depth - 2; j >= 0; j--){
        tree[j] = pairwiseHash(tree[j+1])
    }

    return tree
}

function pairwiseHash (array) {
    if (array.length % 2 == 0){
        const arrayHash = []
        for (var i = 0; i < array.length; i = i + 2){
            arrayHash.push(poseidon(
                [array[i],array[i+1]]
            ))
        }
        return arrayHash
    } else {
        console.log('array must have even number of elements')
    }
}

function getBase2Log (y) {
    return Math.log(y) / Math.log(2);
}

export function rootFromLeafArray (leafArray) {
    return treeFromLeafArray(leafArray)[0][0]
}