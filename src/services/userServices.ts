import { SERVER } from '../config'
import { headers } from './functions'
import { clearTokenService, getTokenService } from './tokenServices'
import { getDarkModeLocalStorageFromLSService, setDarkModeLocalStorageFromLSService } from './localStorageServices'
import { typeUser } from '../models/user'
import { typeResponseData } from '../models/httpResponse'

const base: string = `${SERVER}/api/user`

export const getDarkModeService = (): boolean => getDarkModeLocalStorageFromLSService()
export const setDarkModeService = (darkMode: boolean): void => setDarkModeLocalStorageFromLSService(darkMode)

export const authUserService = async (): Promise<typeUser|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.user) return null
        if (!data.user.isAuth) clearTokenService()
        return data.user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const registerUserService = async (email: string, password: string, group: number, recaptchaToken: string): Promise<typeResponseData|null> => {
    try {
        const response = await fetch(base, {
            method: 'POST',
            headers,
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

export const getUsersService = async (): Promise<typeUser[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/all`, {
            method: 'GET',
            headers
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.users) return null
        return data.users
    } catch (error) {
        console.log(error)
        return null
    }
}

export const modifyUserService = async (user_id: string, estado: boolean, role: number, group: number): Promise<typeUser|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ user_id, estado, role, group })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.user) return null
        return data.user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const changeDarkModeService = async (newMode: boolean): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(`${base}/mode`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ darkMode: newMode })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const assignTerritoryService = async (user_id: string, asignar: number|null, desasignar: number|null, all: boolean|null): Promise<typeUser|null> => {
    if (!getTokenService()) return null
    try {
        all = !all ? false : true
        const response = await fetch(`${base}/assignment`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ user_id, asignar, desasignar, all })
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
            headers
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.email) return null
        return data.email
    } catch (error) {
        console.log(error)
        return null
    }
}

export const sendLinkToRecoverAccount = async (email: string): Promise<any> => {
    try {
        const response = await fetch(base, {
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
