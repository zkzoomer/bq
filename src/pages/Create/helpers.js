import { MAX_QUESTIONS, MAX_ANSWERS } from "../../constants/values"

export const getNullAnswersDict = (key) => {
    var nullAnswersDict = {}
    for (var i = 1; i <= MAX_ANSWERS; i++) {
        nullAnswersDict[key + 'A' + i] = null
    }
    return nullAnswersDict
}

export const getNullAnswersFirstEmptyDict = (key) => {
    var emtpyAnswersDict = {}
    for (var i = 1; i <= MAX_ANSWERS; i++) {
        emtpyAnswersDict[key + 'A' + i] = i === 1 ? "" : null
    }
    return emtpyAnswersDict
}

export const shiftKeysInAnswersDict = (oldKey, oldDict, newKey) => {
    var newDict = {}
    for (var i = 1; i <= MAX_ANSWERS; i++) {
        newDict[newKey + 'A' + i] = oldDict[oldKey + 'A' + i]
    }
    return newDict
}

export const getNumberOfQuestions = (_test) => {
    let _numberQuestions = 0
    for (var i = 1; i <= MAX_QUESTIONS; i++) {
        if (_test['Q' + i].Q !== null) {
            _numberQuestions++
        } else {
            return _numberQuestions
        }
    }
    return _numberQuestions
}

// Gets the number of initialized answers, which are those with strings as values
export const getNumberOfAnswers = (_answers) => {
    let _numberAnswers = 0
    Object.entries(_answers).map(([ key, value ]) => {
        if (value !== null) {
            _numberAnswers++
        } 
    })
    return _numberAnswers
}

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export const answerKeyToLetter = (answerKey) => {
    const index = parseInt(answerKey.split('A')[1]) - 1
    return alphabet[index]
}

export const answerKeyToNumber = (answerKey) => {
    return parseInt(answerKey.split('A')[1])
}

export const getSolutionHash = (_correctAnswers) => {
    return ''
}

// generates a text string that contains the markdown file to be uploaded to ipfs
export const generateMarkdownFile = (_test) => {

}