import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    errorMessage: [],
}

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action) => {
            state.errorMessage = action.payload
        },
    }
})

export const { setError } = errorSlice.actions
export default errorSlice.reducer