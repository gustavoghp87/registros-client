import { AUTH_USER } from './types'
import { SERVER } from '../config.json'


export const auth = async () => {

    const axios = await fetch(`${SERVER}/api/users/auth`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({token:document.cookie})
    })
    const request = await axios.json()

    return {
        type: AUTH_USER,
        payload: request
    }
}
