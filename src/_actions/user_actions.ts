import { AUTH_USER } from './types'
import { authUserService } from '../services/userServices'


export const auth = async () => {

    const request = await authUserService()

    return {
        type: AUTH_USER,
        payload: request
    }
}
