import { store } from '../store'

export type typeRootState = ReturnType<typeof store.getState>
export type typeAppDispatch = typeof store.dispatch
