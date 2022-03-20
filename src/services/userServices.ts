import { SERVER } from '../config'
import { headers } from './functions'
import { clearTokenService, getTokenService } from './tokenServices'
import { getDarkModeLocalStorageFromLSService, setDarkModeLocalStorageFromLSService } from './localStorageServices'
import { typeUser } from '../models/typesUsuarios'

const base: string = `${SERVER}/api/user`

export const getDarkModeService = (): boolean => getDarkModeLocalStorageFromLSService()
export const setDarkModeService = (darkMode: boolean): void => setDarkModeLocalStorageFromLSService(darkMode)

export const authUserService = async (): Promise<typeUser|null> => {
    if (!getTokenService()) return null
    try {
        const request: any = await fetch(`${base}`, {
            method: 'GET',
            headers: headers
        })
        const response: any = await request.json()
        if (!response || !response.success || !response.user || !response.user.isAuth) clearTokenService()
        return response.user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const registerUserService = async (email: string, password: string, group: number, recaptchaToken: string): Promise<object|null> => {
    try {
        const request: any = await fetch(`${base}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ email, password, group, recaptchaToken })
        })
        const response: any = await request.json()
        if (!response || !response.success) return null
        return response
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getUsersService = async (): Promise<typeUser[]|null> => {
    if (!getTokenService()) return null
    try {
        const request: any = await fetch(`${base}/all`, {
            method: 'GET',
            headers: headers
        })
        const response: any = await request.json()
        if (!response || !response.success || !response.users) return null
        return response.users
    } catch (error) {
        console.log(error)
        return null
    }
}

export const modifyUserService = async (user_id: string, estado: boolean, role: number, group: number): Promise<typeUser|null> => {
    if (!getTokenService()) return null
    try {
        const request: any = await fetch(`${base}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ user_id, estado, role, group })
        })
        const response: any = await request.json()
        if (!response || !response.success || !response.user) return null
        return response.user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const changeDarkModeService = async (newMode: boolean): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const request: any = await fetch(`${base}/mode`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ darkMode: newMode })
        })
        const response: any = await request.json()
        if (!response || !response.success) return false
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
        const request: any = await fetch(`${base}/assignment`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ user_id, asignar, desasignar, all })
        })
        const response: any = await request.json()
        if (!response || !response.success || !response.user) return null
        return response.user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getEmailByEmailLink = async (id: string): Promise<string|null> => {
    try {
        const request: any = await fetch(`${base}/recovery/${id}`, {
            method: 'GET',
            headers: headers
        })
        const response: any = await request.json()
        if (!response || !response.success || !response.email) return null
        return response.email
    } catch (error) {
        console.log(error)
        return null
    }
}

export const sendLinkToRecoverAccount = async (email: string): Promise<any> => {
    try {
        const request: any = await fetch(`${base}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({ email })
        })
        const response: any = await request.json()
        return response
    } catch (error) {
        console.log(error)
        return null
    }
}
