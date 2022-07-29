import { createSlice, PayloadAction } from '@reduxjs/toolkit'
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

const uls = localStorage.getItem('user')
const userInLS: typeUser = uls ? JSON.parse(uls) : unauthenticatedUser

export const userSlice = createSlice({
    name: 'user',
    initialState: userInLS,
    reducers: {
        logout: (state) => {
            logoutService()
            state = unauthenticatedUser
            localStorage.setItem('user', JSON.stringify(unauthenticatedUser))
            return state
        },
        refreshUser: (state, action: PayloadAction<typeUser>) => {
            state = action.payload
            localStorage.setItem('user', JSON.stringify(action.payload))
            return state
        }
    }
})

export const { logout, refreshUser } = userSlice.actions
