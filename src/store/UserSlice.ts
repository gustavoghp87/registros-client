import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getUserFromLSService, setConfigToLSService, setUserToLSService } from '../services/localStorageServices'
import { logoutService } from '../services'
import { typeUser } from '../models'
import { unauthenticatedConfig } from '.'

const unauthenticatedUser: typeUser = {
    congregation: 0,
    email: "",
    // group: 0,
    hthAssignments: [],
    id: 0,
    isActive: false,
    isAdmin: false,
    isAuth: false,
    isBuildingManager: false,
    phoneAssignments: [],
    role: 0
}

const uls = getUserFromLSService()

export const userSlice = createSlice({
    name: 'user',
    initialState: uls ?? unauthenticatedUser,
    reducers: {
        logoutReducer: (state) => {
            setUserToLSService(unauthenticatedUser)
            setConfigToLSService(unauthenticatedConfig)
            logoutService()
            state = unauthenticatedUser
            return state
        },
        refreshUserReducer: (state, action: PayloadAction<typeUser>) => {
            setUserToLSService(action.payload)
            state = action.payload
            return state
        },
        setAnonymousEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload
            return state
        }
    }
})

export const { logoutReducer, refreshUserReducer, setAnonymousEmail } = userSlice.actions
