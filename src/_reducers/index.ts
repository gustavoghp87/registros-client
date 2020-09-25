import {counterReducer, logReducer} from './user_reducers';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    counter: counterReducer,
    login: logReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>