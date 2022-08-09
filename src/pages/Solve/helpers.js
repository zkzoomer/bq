import { Web3Storage } from 'web3.storage'

import { SUPPORTED_MARKDOWN_STRING_LITERALS as stringLiterals } from "../../constants/supportedMarkdown"
import { MAX_QUESTIONS } from '../../constants/values'

function getAccessToken () {
    return process.env.REACT_APP_WEB3STORAGE_TOKEN
}

export async function tokenUriToTest (tokenURI) {
    const cid = tokenURI.split('https://')[1].split('.ipfs.dweb.link/')[0]
    const client = new Web3Storage({ token: getAccessToken() })

    const res = await client.get(cid)
    const files = await res.files()
    const content = await files[0].text()
    
    const test = {
        title: (content.split(stringLiterals.title)[1].split(stringLiterals.description)[0]).trim(),
        description: (content.split(stringLiterals.description)[1].split(stringLiterals.questionStart)[0]).trim()
    }

    content.split(stringLiterals.questionStart).map( (question, index) => {
        if (index === 0) { return };
        const questionObject = {}
        const answerObject = {}
        question.split(stringLiterals.answerStart).map( (answer, _index) => {
            if (_index === 0) {
                // not an answer, but the question text
                questionObject.Q = answer.trim()
            } else {
                answerObject['Q' + index + 'A' + _index] = answer.trim()
            }
        })
        questionObject.A = answerObject;
        test['Q' + index] = questionObject
    })

    return test
}

export function stylizeTokenId (tokenId) {
    let num = tokenId.toString();
    while (num.length < 4) num = "0" + num;
    return '#' + num
}

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export const answerKeyToLetter = (answerKey) => {
    const index = parseInt(answerKey.split('A')[1]) - 1
    return alphabet[index]
}

export const answerKeyToNumber = (answerKey) => {
    return parseInt(answerKey.split('A')[1])
}

export const getNumberOfQuestions = (_test) => {
    let _numberQuestions = 0
    for (var i = 1; i <= MAX_QUESTIONS; i++) {
        try {
            if (_test['Q' + i].Q !== null) {
                _numberQuestions++
            }
        } catch (err) {
            return _numberQuestions
        }
    }
    return _numberQuestions
}
    