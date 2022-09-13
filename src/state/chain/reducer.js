import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selectedChain: 'evmos_testnet', 
    correctChain: false,
}

const chainSlice = createSlice({
    name: 'chain',
    initialState,
    reducers: {
        setSelectedChain: (state, action) => {
            state.selectedChain = action.payload
        },
        setCorrectChain: (state, action) => {
            state.correctChain = action.payload
        },
    }
})

export const { setSelectedChain, setCorrectChain } = chainSlice.actions
export default chainSlice.reducer