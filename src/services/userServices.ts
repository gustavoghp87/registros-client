import { pointer } from '../config'
import { getDarkModeFromLSService, getHeaders, getTokenFromLSService, removeTokenFromLSService, setDarkModeToLSService, setTokenToLSService, setUserToLSService } from '.'
import { typeResponseData, typeUser } from '../models'

const base: string = pointer.user

export const getDarkModeService = (): boolean => getDarkModeFromLSService()
export const setDarkModeService = (darkMode: boolean): void => setDarkModeToLSService(darkMode)
export const getTokenService = (): string|null => getTokenFromLSService()
export const setTokenService = (newToken: string): void => setTokenToLSService(newToken)
const removeTokenService = (): void => removeTokenFromLSService()

export const assignTerritoryService = async (email: string, toAssign: number|null, toUnassign: number|null, all: boolean|null): Promise<typeUser|null> => {
    if (!getTokenService()) return null
    try {
        all = !!all
        const response = await fetch(`${base}/assignment`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ email, toAssign, toUnassign, all })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.user) return null
        return data.user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const changePswService = async (psw: string|null, newPsw: string, id: string|null): Promise<typeResponseData|null> => {
    if (!getTokenService() && !id) return null
    try {
        const response = await fetch(`${base}/token`, {
            method: 'PUT',
            headers: getHeaders(),
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

export const changePswOtherUserService = async (email: string): Promise<[string, boolean]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/token`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ email })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.newPassword) return null
        data.emailSuccess = !!data.emailSuccess
        return [data.newPassword, data.emailSuccess]
    } catch (error) {
        console.log(error)
        return null
    }
}

export const editUserService = async (email: string, isActive: boolean, role: number, group: number): Promise<typeUser|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ email, isActive, role, group })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.user) return null
        return data.user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getEmailByEmailLink = async (id: string): Promise<string|null> => {
    try {
        const response = await fetch(`${base}/recovery/${id}`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.email) return null
        return data.email
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getUserByTokenService = async (): Promise<typeUser|false|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.user) {
            if (data && !data.success) removeTokenService()
            return false
        }
        data.user.isAuth = true
        data.user.isAdmin = data.user.role === 1
        setUserToLSService(JSON.stringify(data.user))
        return data.user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getUserByTokenService1 = async (token: string): Promise<typeUser|false|null> => {
    if (!token) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers: { ...getHeaders(), 'x-Authorization': token }
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.user) {
            if (data && !data.success) removeTokenService()
            return false
        }
        data.user.isAuth = true
        data.user.isAdmin = data.user.role === 1
        setUserToLSService(JSON.stringify(data.user))
        return data.user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getUsersService = async (): Promise<typeUser[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/all`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.users) return null
        return data.users
    } catch (error) {
        console.log(error)
        return null
    }
}

export const loginService = async (email: string, password: string, recaptchaToken: string): Promise<typeResponseData|null> => {
    try {
        const response: any = await fetch(`${base}/token`, {
            method: 'POST',
            headers: getHeaders(),
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

export const logoutAllService = async (): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(`${base}/token`, {
            method: 'DELETE',
            headers: getHeaders()
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

export const logoutService = (): void => {
    removeTokenService()
}

export const registerUserService = async (email: string, password: string, group: number, recaptchaToken: string): Promise<typeResponseData|null> => {
    try {
        const response = await fetch(base, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password, group, recaptchaToken })
        })
        const data: typeResponseData = await response.json()
        if (!data) return null
        data.userExists = !data.userExists ? false : true
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const sendLinkToRecoverAccount = async (email: string): Promise<any> => {
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ email })
        })
        const data: typeResponseData = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}
