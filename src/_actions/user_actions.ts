import { AUTH_USER } from './types'
import { SERVER } from '../config'
import { getToken } from '../services/getToken'


export const auth = async () => {

    const fetchy = await fetch(`${SERVER}/api/users/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ token: getToken() })
    })
    const request = await fetchy.json()

    return {
        type: AUTH_USER,
        payload: request
    }
}
