import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getUserFromLSService, setUserFromLSService } from '../services'
import { logoutService } from '../services/userServices'
import { typeUser } from '../models'

const unauthenticatedUser: typeUser = {
    _id: { id: 0 },
    isAuth: false,
    isAdmin: false,
    role: 0,
    email: "",
    estado: false,
    group: 0
}

const uls: string|null = getUserFromLSService()
const userInLS: typeUser = uls ? JSON.parse(uls) : unauthenticatedUser

export const userSlice = createSlice({
    name: 'user',
    initialState: userInLS,
    reducers: {
        logoutReducer: (state) => {
            setUserFromLSService(JSON.stringify(unauthenticatedUser))
            logoutService()
            state = unauthenticatedUser
            return state
        },
        refreshUserReducer: (state, action: PayloadAction<typeUser>) => {
            setUserFromLSService(JSON.stringify(action.payload))
            state = action.payload
            return state
        }
    }
})

export const { logoutReducer, refreshUserReducer } = userSlice.actions
