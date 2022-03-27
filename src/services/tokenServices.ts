import { SERVER } from '../config'
import { typeResponseData } from '../models/httpResponse'
import { headers } from './functions'
import { clearTokenFromLSService, clearUserFromLSService, getTokenFromLSService, setTokenFromLSService } from './localStorageServices'

const base: string = `${SERVER}/api/token`

export const getTokenService = (): string|null => getTokenFromLSService()
export const setTokenService = (newToken: string): void => setTokenFromLSService(newToken)
export const clearTokenService = (): void => clearTokenFromLSService()
const clearUserService = (): void => clearUserFromLSService()

export const loginService = async (email: string, password: string, recaptchaToken: string): Promise<typeResponseData|null> => {
    try {
        const response: any = await fetch(`${base}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email, password, recaptchaToken })
        })
        const data: typeResponseData = await response.json()
        if (data && data.success && data.newToken) setTokenService(data.newToken)
        return data
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
        const response = await fetch(`${base}`, {
            method: 'DELETE',
            headers
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.newToken) return false
        setTokenService(data.newToken)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const changePswService = async (psw: string|null, newPsw: string, id: string|null): Promise<typeResponseData|null> => {
    if (!getTokenService() && !id) return null
    try {
        const response = await fetch(`${base}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ psw, newPsw, id })
        })
        const data: typeResponseData = await response.json()
        if (data && data.success && data.newToken) setTokenService(data.newToken)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const changePswOtherUserService = async (email: string): Promise<typeResponseData|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ email })
        })
        const data: typeResponseData = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}
