import { SERVER } from '../config'
import { headers } from './functions'
import { clearTokenFromLSService, clearUserFromLSService, getTokenFromLSService, setTokenFromLSService } from './localStorageServices'

const base: string = `${SERVER}/api/token`

type responseType = {
    success: boolean,
    newToken?: string,
    recaptchaFails?: boolean
    isDisabled?: boolean
}

export const getTokenService = (): string|null => getTokenFromLSService()
export const setTokenService = (newToken: string): void => setTokenFromLSService(newToken)
export const clearTokenService = (): void => clearTokenFromLSService()
const clearUserService = (): void => clearUserFromLSService()

export const loginService = async (email: string, password: string, recaptchaToken: string): Promise<responseType|null> => {
    try {
        const request: any = await fetch(`${base}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email, password, recaptchaToken })
        })
        const response: responseType|null = await request.json()
        if (response && response.success && response.newToken) setTokenService(response.newToken)
        return response
    } catch (error) {
        console.log(error)
        return null
    }
}

export const logoutService = (): void => {
    clearTokenService()
    clearUserService()
}

export const logoutAllService = async (): Promise<boolean> => {
    if (!getTokenService()) return false;
    try {
        const request = await fetch(`${base}`, {
            method: 'DELETE',
            headers
        })
        const response: any = await request.json()
        if (!response || !response.success || !response.newToken) return false
        setTokenService(response.newToken)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const changePswService = async (psw: string|null, newPsw: string, id: string|null): Promise<object|null> => {
    if (!getTokenService() && !id) return null
    try {
        const fetchy = await fetch(`${base}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ psw, newPsw, id })
        })
        const response: any = await fetchy.json()
        if (response && response.success && response.newToken) setTokenService(response.newToken)
        return response
    } catch (error) {
        console.log(error)
        return null
    }
}

export const changePswOtherUserService = async (email: string): Promise<object|null> => {
    if (!getTokenService()) return null
    try {
        const request = await fetch(`${base}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ email })
        })
        const response: any = await request.json()
        return response
    } catch (error) {
        console.log(error)
        return null
    }
}
