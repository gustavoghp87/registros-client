import { SERVER } from '../config'
import { getHeaders, getToken } from './functions'
import { typeUser } from '../models/typesUsuarios'

const base = `${SERVER}/api/users`
const setToken = (newToken: string) => localStorage.setItem('token', newToken)
const clearToken = () => localStorage.removeItem('token')

export const loginService = async (email: string, password: string, recaptchaToken: string): Promise<any|null> => {
    const request: any = await fetch(`${base}/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password, recaptchaToken })
    })
    const response: any|null = await request.json()
    if (response && response.success && response.newtoken) setToken(response.newtoken)
    return response
}

export const registerUserService = async (email: string,
     password: string, group: number, recaptchaToken: string): Promise<object|null> => {
    const request: any = await fetch(`${base}/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password, group, recaptchaToken })
    })
    const response: any = await request.json()
    if (!response || !response.success) { console.log("Failed /register"); return null }
    return response
}

export const authUserService = async (): Promise<typeUser|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request = await fetch(`${base}/auth`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token })
    })
    const userData: typeUser|null = await request.json()
    if (!userData || !userData.isAuth) { console.log("Failed /auth"); clearToken(); return null }
    return userData
}

export const autoLoginService = async (): Promise<boolean> => {
    const user: typeUser|null = await authUserService()
    if (!user) return false
    return true
}

export const getUsersService = async (): Promise<typeUser[]|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request = await fetch(`${base}/get-all`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token })
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.users) return null
    return response.users
}

export const changeDarkModeService = async (newMode: boolean): Promise<object|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request = await fetch(`${base}/change-mode`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token, darkMode: newMode })
    })
    const response: any|null = await request.json()
    return response
}

export const changePswService = async (psw: string, newPsw: string): Promise<object|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const fetchy = await fetch(`${base}/change-psw`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token, psw, newPsw })
    })
    const response: any|null = await fetchy.json()
    if (!response || !response.success) { console.log("Failed /change-psw") }
    if (response && response.success && response.newToken) setToken(response.newToken)
    return response
}

export const changePswOtherUserService = async (email: string): Promise<boolean> => {
    const token: string|null = getToken()
    if (!token) return false
    const request = await fetch(`${base}/change-psw-other-user`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token, email })
    })
    const response: any|null = await request.json()
    if (!response || !response.success) return false
    return true
}

export const logoutService = async (): Promise<void> => {
    const token: string|null = getToken()
    if (!token) return;
    const request = await fetch(`${base}/logout`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token })
    })
    const response: any|null = await request.json()
    if (response && response.success) console.log("Sesión de usuario cerrada con éxito")
    else console.log("Algo falló y no cerró sesión bien")
    clearToken()
}

export const modifyUserService = async (user_id: string, estado: boolean, role: number, group: number): Promise<typeUser|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request = await fetch(`${base}/controlar-usuario`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token, user_id, estado, role, group })
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
    const request = await fetch(`${base}/asignar`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token, user_id, asignar, desasignar, all })
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.user) return null
    return response.user
}
