import { _groth16Prove } from './snarkjs.js'
import { builder } from "./witness_calculator.js";

const genWnts = async (input, wasmFilePath) => {
    let wntsBuff;
    
    const resp = await fetch(wasmFilePath);
    wntsBuff = await resp.arrayBuffer();

    return new Promise((resolve, reject) => {
    builder(wntsBuff)
        .then(async (witnessCalculator) => {
        const buff = await witnessCalculator.calculateWTNSBin(input, 0);
        resolve(buff);
        })
        .catch((error) => {
        reject(error);
        });
    });
};

export const genProof = async (
    grothInput,
    wasmFilePath,
    finalZkeyPath
) => {
    let zkeyBuff;
    const wtnsBuff = await genWnts(grothInput, wasmFilePath);
    
    const resp = await fetch(finalZkeyPath);
    zkeyBuff = await resp.arrayBuffer();

    const { proof, publicSignals } = await _groth16Prove(
        new Uint8Array(zkeyBuff),
        wtnsBuff,
        null
    );
    return { proof, publicSignals };
};