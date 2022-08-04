import { createSlice } from '@reduxjs/toolkit'

export const loadingModalSlice = createSlice({
    name: 'loadingModal',
    initialState: { showingLoadingModal: false },
    reducers: {
        hideLoadingModalReducer: (state) => {
            state.showingLoadingModal = false
            return state
        },
        showLoadingModalReducer: (state) => {
            state.showingLoadingModal = true
            return state
        }
    }
})

export const { hideLoadingModalReducer, showLoadingModalReducer } = loadingModalSlice.actions
