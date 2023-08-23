import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { typeConfig } from '../models'

const initialState: typeConfig = {
    congregation: 0,
    googleBoardUrl: '',
    name: "",
    numberOfTerritories: 0
}

export const configurationSlice = createSlice({
    name: 'configuration',
    initialState,
    reducers: {
        setConfigurationReducer: (state, action: PayloadAction<typeConfig>) => {
            if (Number.isInteger(action.payload.numberOfTerritories)) {
                state = action.payload
            }
            return state
        }
    }
})

export const { setConfigurationReducer } = configurationSlice.actions
