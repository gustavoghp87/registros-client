import { SERVER } from '../config'
import { getToken, headers } from './functions'

const base: string = `${SERVER}/api/token`
const setToken = (newToken: string) => localStorage.setItem('token', newToken)
export const clearToken = () => localStorage.removeItem('token')
const clearUser = () => localStorage.removeItem('user')

type responseType = {
    success: boolean,
    newToken?: string,
    recaptchaFails?: boolean
    isDisabled?: boolean
}
export const loginService = async (email: string, password: string, recaptchaToken: string): Promise<responseType|null> => {
    try {
        const request: any = await fetch(`${base}/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ email, password, recaptchaToken })
        })
        const response: responseType|null = await request.json()
        if (response && response.success && response.newToken) setToken(response.newToken)
        return response
    } catch (error) {
        console.log(error)
        return null
    }
}

export const logoutService = (): void => {
    clearToken()
    clearUser()
}

export const logoutAllService = async (): Promise<boolean> => {
    const token: string|null = getToken()
    if (!token) return false;
    try {
        const request = await fetch(`${base}/`, {
            method: 'DELETE',
            headers: headers
        })
        const response: any|null = await request.json()
        if (!response || !response.success || !response.newToken) return false
        setToken(response.newToken)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const changePswService = async (psw: string|null, newPsw: string, id: string|null): Promise<object|null> => {
    const token: string|null = getToken()
    if (!token && !id) return null
    try {
        const fetchy = await fetch(`${base}/`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ psw, newPsw, id })
        })
        const response: any|null = await fetchy.json()
        if (response && response.success && response.newToken) setToken(response.newToken)
        return response
    } catch (error) {
        console.log(error)
        return null
    }
}

export const changePswOtherUserService = async (email: string): Promise<object|null> => {
    const token: string|null = getToken()
    if (!token) return null
    try {
        const request = await fetch(`${base}/`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({ email })
        })
        const response: any|null = await request.json()
        return response
    } catch (error) {
        console.log(error)
        return null
    }
}
