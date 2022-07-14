import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type typeMode = 'alert' | 'confirm'

type typeAlertModalState = {
    showingAlertModal?: boolean
    mode: typeMode
    title: string
    message: string
    execution?: Function|undefined
}

const initialState: typeAlertModalState = {
    showingAlertModal: false,
    title: "",
    message: "",
    mode: 'alert'
}

export const alertModalSlice = createSlice({
    name: 'alertModal',
    initialState,
    reducers: {
        setValuesAndOpenAlertModalReducer: (state, action: PayloadAction<typeAlertModalState>) => {
            state = {
                showingAlertModal: true,
                mode: action?.payload?.mode ?? 'alert',
                title: action?.payload?.title || "",
                message: action?.payload?.message || "",
                execution: action?.payload?.execution
            }
            return state
        },
        closeAlertModalReducer: (state) => {
            state = {
                showingAlertModal: false,
                mode: 'alert',
                title: "",
                message: ""
            }
            return state
        }
    }
})

export const { setValuesAndOpenAlertModalReducer, closeAlertModalReducer } = alertModalSlice.actions
