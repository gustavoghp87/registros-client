import { configureStore } from '@reduxjs/toolkit'
import { alertModalSlice, darkModeSlice, loadingModalSlice, mobileModeSlice, userSlice } from './'

export const store = configureStore({
    reducer: {
        alertModal: alertModalSlice.reducer,
        darkMode: darkModeSlice.reducer,
        loadingModal: loadingModalSlice.reducer,
        mobileMode: mobileModeSlice.reducer,
        user: userSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
