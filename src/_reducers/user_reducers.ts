import { AUTH_USER } from '../_actions/types'


export const user = (state:any = {}, action:any) => {
    switch(action.type) {
        case AUTH_USER:
            return { ...state, userData: action.payload }
        default:
            return state
    }
}
