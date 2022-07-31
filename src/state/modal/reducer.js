import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    modalShowing: "",
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setModal: (state, action) => {
            state.modalShowing = action.payload
        },
    }
})

export const { setModal } = modalSlice.actions
export default modalSlice.reducer