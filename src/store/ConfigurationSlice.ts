import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type typeConfigurationState = {
    name: string
    numberOfTerritories: number
}

export const configurationSlice = createSlice({
    name: 'configuration',
    initialState: {
        name: "",
        numberOfTerritories: 0
    },
    reducers: {
        setConfigurationReducer: (state, action: PayloadAction<typeConfigurationState>) => {
            if (Number.isInteger(action.payload.numberOfTerritories)) {
                state = action.payload
            }
            return state
        }
    }
})

export const { setConfigurationReducer } = configurationSlice.actions
