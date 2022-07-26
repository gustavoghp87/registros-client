import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { logoutService } from '../services/userServices'
import { typeUser } from '../models'

const unauthenticatedUser: typeUser = {
    _id: { id: 0 },
    isAuth: !!localStorage.getItem('token'),
    isAdmin: false,
    role: 0,
    email: "",
    estado: false,
    group: 0
}

export const userSlice = createSlice({
    name: 'user',
    initialState: unauthenticatedUser,
    reducers: {
        logout: (state) => {
            logoutService()
            state = unauthenticatedUser
            return state
        },
        refreshUser: (state, action: PayloadAction<typeUser>) => {
            state = action.payload
            return state
        }
    }
})

export const { logout, refreshUser } = userSlice.actions
