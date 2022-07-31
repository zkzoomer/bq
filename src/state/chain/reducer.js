import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    correctChain: false,
}

const chainSlice = createSlice({
    name: 'chain',
    initialState,
    reducers: {
        setCorrectChain: (state, action) => {
            state.correctChain = action.payload
        },
    }
})

export const { setCorrectChain } = chainSlice.actions
export default chainSlice.reducer