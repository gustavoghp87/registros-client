import { createSlice } from '@reduxjs/toolkit'
import { getDarkModeFromLSService, setDarkModeToLSService } from '../services/localStorageServices'

export const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState: { isDarkMode: getDarkModeFromLSService() },
    reducers: {
        changeDarkModeReducer: (state) => {
            const newValue: boolean = !getDarkModeFromLSService()
            setDarkModeToLSService(newValue)
            state = { isDarkMode: newValue }
            return state
        }
    }
})

export const { changeDarkModeReducer } = darkModeSlice.actions
