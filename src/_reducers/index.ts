import { counterReducer, logReducer, user } from './user_reducers';
import { combineReducers } from 'redux';

const rootReducer:any = combineReducers({
    counter: counterReducer,
    login: logReducer,
    user
});

export default rootReducer;

export type RootState = ReturnType<any>