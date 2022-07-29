import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type typeMobileModeState = {
    isMobile: boolean
}

export const mobileModeSlice = createSlice({
    name: 'mobileMode',
    initialState: { isMobile: window.screen.width < 992 },
    reducers: {
        changeMobileModeReducer: (state, action: PayloadAction<typeMobileModeState>) => {
            state = { isMobile: action.payload.isMobile }
            return state
        }
    }
})

export const { changeMobileModeReducer } = mobileModeSlice.actions
