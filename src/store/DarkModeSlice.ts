import { createSlice } from '@reduxjs/toolkit'
import { getDarkModeService, setDarkModeService } from '../services/userServices'

export const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState: { isDarkMode: getDarkModeService() },
    reducers: {
        changeDarkModeReducer: (state) => {
            const newValue: boolean = !getDarkModeService()
            setDarkModeService(newValue)
            state = { isDarkMode: newValue }
            return state
        }
    }
})

export const { changeDarkModeReducer } = darkModeSlice.actions
