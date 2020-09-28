import { user } from './user_reducers';
import { combineReducers } from 'redux';

const rootReducer:any = combineReducers({
    user
});

export default rootReducer;

export type RootState = ReturnType<any>