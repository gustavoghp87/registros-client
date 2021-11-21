import { SERVER } from '../config'
import { getToken, headers } from './functions'
import { clearToken } from './tokenServices'
import { typeUser } from '../models/typesUsuarios'

const base: string = `${SERVER}/api/user`

export const authUserService = async (): Promise<typeUser|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request: any|null = await fetch(`${base}/`, {
        method: 'GET',
        headers: headers
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.user || !response.user.isAuth) clearToken()
    return response.user
}

export const registerUserService = async (email: string,
    password: string, group: number, recaptchaToken: string): Promise<object|null> => {
    const request: any|null = await fetch(`${base}/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ email, password, group, recaptchaToken })
    })
    const response: any|null = await request.json()
    if (!response || !response.success) return null
    return response
}

export const getUsersService = async (): Promise<typeUser[]|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request: any|null = await fetch(`${base}/all`, {
        method: 'GET',
        headers: headers
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.users) return null
    return response.users
}

export const changeDarkModeService = async (newMode: boolean): Promise<boolean> => {
    const token: string|null = getToken()
    if (!token) return false
    const request = await fetch(`${base}/`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ darkMode: newMode })
    })
    const response: any|null = await request.json()
    if (!response || !response.success) return false
    return true
}

export const modifyUserService = async (user_id: string, estado: boolean, role: number, group: number): Promise<typeUser|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request = await fetch(`${base}/`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ user_id, estado, role, group })
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.user) return null
    return response.user
}

export const assignTerritoryService = async (user_id: string,
     asignar: number|null, desasignar: number|null, all: boolean|null): Promise<typeUser|null> => {
    const token: string|null = getToken()
    if (!token) return null
    all = !all ? false : true
    const request = await fetch(`${base}/`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ user_id, asignar, desasignar, all })
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.user) return null
    return response.user
}
