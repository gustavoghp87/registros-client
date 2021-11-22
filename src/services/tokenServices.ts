import { SERVER } from '../config'
import { getToken, headers } from './functions'

const base: string = `${SERVER}/api/token`
const setToken = (newToken: string) => localStorage.setItem('token', newToken)
export const clearToken = () => localStorage.removeItem('token')

export const loginService = async (email: string, password: string, recaptchaToken: string): Promise<any|null> => {
    const request: any = await fetch(`${base}/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ email, password, recaptchaToken })
    })
    const response: any|null = await request.json()
    if (response && response.success && response.newToken) setToken(response.newToken)
    return response
}

export const logoutService = (): void => {
    clearToken()
}

export const logoutAllService = async (): Promise<boolean> => {
    const token: string|null = getToken()
    if (!token) return false;
    const request = await fetch(`${base}/`, {
        method: 'DELETE',
        headers: headers
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.newToken) return false
    setToken(response.newToken)
    return true
}

export const changePswService = async (psw: string|null, newPsw: string, id: string|null): Promise<object|null> => {
    const token: string|null = getToken()
    if (!token && !id) return null
    const fetchy = await fetch(`${base}/`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ psw, newPsw, id })
    })
    const response: any|null = await fetchy.json()
    if (response && response.success && response.newToken) setToken(response.newToken)
    return response
}

export const changePswOtherUserService = async (email: string): Promise<object|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request = await fetch(`${base}/`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ email })
    })
    const response: any|null = await request.json()
    return response
}
