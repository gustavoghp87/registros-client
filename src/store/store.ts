import { configureStore } from '@reduxjs/toolkit'
import { alertModalSlice } from './AlertModalSlice'
import { darkModeSlice } from './DarkModeSlice'
import { mobileModeSlice } from './MobileMode.Slice'

export const store = configureStore({
    reducer: {
        alertModal: alertModalSlice.reducer,
        darkMode: darkModeSlice.reducer,
        mobileMode: mobileModeSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type typeRootState = ReturnType<typeof store.getState>
export type typeAppDispatch = typeof store.dispatch
