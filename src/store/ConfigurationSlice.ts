import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getConfigFromLSService, setConfigToLSService } from '../services'
import { typeConfig } from '../models'

export const unauthenticatedConfig: typeConfig = {
    congregation: 0,
    googleBoardUrl: '',
    isDisabledCloseHthFaces: true,
    isDisabledEditHthMaps: true,
    isDisabledHthBuildingsForUnassignedUsers: true,
    isDisabledHthFaceObservations: true,
    name: "",
    numberOfTerritories: 0
}

const configLocalStorage = getConfigFromLSService()

export const configurationSlice = createSlice({
    name: 'configuration',
    initialState: configLocalStorage ?? unauthenticatedConfig,
    reducers: {
        setConfigurationReducer: (state, action: PayloadAction<typeConfig>) => {
            if (Number.isInteger(action.payload.numberOfTerritories)) {
                state = action.payload
                setConfigToLSService(action.payload)
            }
            return state
        }
    }
})

export const { setConfigurationReducer } = configurationSlice.actions
