import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getUserFromLSService, setUserToLSService } from '../services'
import { logoutService } from '../services/userServices'
import { typeUser } from '../models'

const unauthenticatedUser: typeUser = {
    congregation: 0,
    email: "",
    group: 0,
    hthAssignments: [],
    id: 0,
    isActive: false,
    isAdmin: false,
    isAuth: false,
    phoneAssignments: [],
    role: 0
}

const uls: string|null = getUserFromLSService()
const userInLS: typeUser = uls ? JSON.parse(uls) : unauthenticatedUser

export const userSlice = createSlice({
    name: 'user',
    initialState: userInLS,
    reducers: {
        logoutReducer: (state) => {
            setUserToLSService(JSON.stringify(unauthenticatedUser))
            logoutService()
            state = unauthenticatedUser
            return state
        },
        refreshUserReducer: (state, action: PayloadAction<typeUser>) => {
            setUserToLSService(JSON.stringify(action.payload))
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
