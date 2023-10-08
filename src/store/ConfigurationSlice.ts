import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getConfigFromLSService, setConfigToLSService } from '../services/localStorageServices'
import { typeConfig } from '../models'

export const unauthenticatedConfig: typeConfig = {
    congregation: 0,
    date: 0,
    dbBackupLastDate: '',
    googleBoardUrl: '',
    isDisabledCloseHthFaces: true,
    isDisabledEditHthMaps: true,
    isDisabledHthBuildingsForUnassignedUsers: true,
    isDisabledHthFaceObservations: true,
    name: "",
    numberOfTerritories: 0,
    usingLettersForBlocks: false
}

const configLocalStorage = getConfigFromLSService ? getConfigFromLSService() : alert("No se cargó Config LS Service")

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
