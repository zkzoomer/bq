import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isOpen: false,
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setIsOpen: (state, action) => {
            state.isOpen = action.payload
        },
    }
})

export const { setIsOpen } = sidebarSlice.actions
export default sidebarSlice.reducer