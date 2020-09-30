import { user } from './user_reducers'
import { combineReducers } from 'redux'


type RootState = ReturnType<any>

const rootReducer:RootState = combineReducers({
    user
})

export default rootReducer
