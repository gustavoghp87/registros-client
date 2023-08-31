import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type typeMode = 'alert' | 'confirm'

type typeAlertModalState = {
    animation?: number
    execution?: Function
    executionOnCancelling?: Function
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
                animation: undefined,
                message: "",
                mode: 'alert',
                showingAlertModal: false,
                title: ""
            }
            return state
        },
        setValuesAndOpenAlertModalReducer: (state, action: PayloadAction<typeAlertModalState>) => {
            state = {
                animation: action.payload.animation,
                execution: action.payload.execution,
                executionOnCancelling: action.payload.executionOnCancelling,
                message: action.payload.message || "",
                mode: action.payload.mode ?? 'alert',
                showingAlertModal: true,
                title: action.payload.title || "",
            }
            return state
        }
    }
})

export const { setValuesAndOpenAlertModalReducer, closeAlertModalReducer } = alertModalSlice.actions
