import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type typeMode = 'alert' | 'confirm'

type typeAlertModalState = {
    execution?: Function|undefined
    message: string
    mode: typeMode
    showingAlertModal?: boolean
    title: string
}

const initialState: typeAlertModalState = {
    message: "",
    mode: 'alert',
    showingAlertModal: false,
    title: ""
}

export const alertModalSlice = createSlice({
    name: 'alertModal',
    initialState,
    reducers: {
        closeAlertModalReducer: (state) => {
            state = {
                showingAlertModal: false,
                mode: 'alert',
                title: "",
                message: ""
            }
            return state
        },
        setValuesAndOpenAlertModalReducer: (state, action: PayloadAction<typeAlertModalState>) => {
            state = {
                showingAlertModal: true,
                mode: action?.payload?.mode ?? 'alert',
                title: action?.payload?.title || "",
                message: action?.payload?.message || "",
                execution: action?.payload?.execution
            }
            return state
        }
    }
})

export const { setValuesAndOpenAlertModalReducer, closeAlertModalReducer } = alertModalSlice.actions
