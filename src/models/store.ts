import { store } from '../store'

export type typeRootState = ReturnType<typeof store.getState>

// type typeAppDispatch = typeof store.dispatch
