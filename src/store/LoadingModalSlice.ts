import { createSlice } from '@reduxjs/toolkit'

export const loadingModalSlice = createSlice({
    name: 'loadingModal',
    initialState: { showingLoadingModal: false },
    reducers: {
        hideLoadingModal: () => {
            return { showingLoadingModal: false }
        },
        showLoadingModal: () => {
            return { showingLoadingModal: true }
        }
    }
})

export const { hideLoadingModal, showLoadingModal } = loadingModalSlice.actions
