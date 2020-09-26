import { INCREMENT, DECREMENT, LOG_IN, AUTH_USER } from '../_actions/types';

export const counterReducer = (state:number = 0, action:any) => {
    switch(action.type) {
        case INCREMENT:
            return state + 1;
        case DECREMENT:
            return state - action.payload;
        default:
            return state;
    };
};

export const logReducer = (state:boolean = false, action:any) => {
    switch(action.type) {
        case LOG_IN:
            return !state;
        default:
            return state;
    };
};

export const user = (state:any = {}, action:any) => {
    switch(action.type) {
        case AUTH_USER:
            return { ...state, userData: action.payload }
        default:
            return state;
    };
};
