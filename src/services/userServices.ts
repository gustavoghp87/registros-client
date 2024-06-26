import { getHeaders } from '.'
import { getTokenFromLSService, removeTokenFromLSService, setTokenToLSService, setUserToLSService } from './localStorageServices'
import { pointer } from '../app-config'
import { typeConfig, typeResponseData, typeUser } from '../models'
import { unauthenticatedConfig } from '../store'

const base: string = pointer.user

export const assignHTHTerritoryService = async (email: string, toAssign: number|null, toUnassign: number|null, all: boolean|null): Promise<typeUser|null> => {
    if (!getTokenFromLSService()) return null
    try {
        all = !!all
        const response = await fetch(`${base}/hth-assignment`, {
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

export const assignTLPTerritoryService = async (email: string, toAssign: number|null, toUnassign: number|null, all: boolean|null): Promise<typeUser|null> => {
    if (!getTokenFromLSService()) return null
    try {
        all = !!all
        const response = await fetch(`${base}/tlp-assignment`, {
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

export const changeEmailService = async (newEmail: string): Promise<typeResponseData|null> => {
    if (!getTokenFromLSService() && !newEmail) return null
    try {
        const response = await fetch(`${base}/token`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ newEmail })
        })
        const data: typeResponseData = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const changePswService = async (team: number, psw: string|null, newPsw: string, id: string|null): Promise<typeResponseData|null> => {
    if (!getTokenFromLSService() && !id) return null
    try {
        const response = await fetch(`${base}/token`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ team, psw, newPsw, id })
        })
        const data: typeResponseData = await response.json()
        if (data && data.success && data.newToken) setTokenToLSService(data.newToken)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const changePswOtherUserService = async (email: string): Promise<[string, boolean]|null> => {
    if (!getTokenFromLSService()) return null
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

export const deleteUserService = async (userId: number): Promise<boolean> => {
    if (!getTokenFromLSService()) return false
    try {
        const response = await fetch(base, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ userId })
        })
        const data: typeResponseData = await response.json()
        return !!data && data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const editUserService = async (email: string, isActive: boolean, role: number): Promise<typeUser|null> => {
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(base, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ email, isActive, role })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.user) return null
        return data.user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getEmailByEmailLink = async (congregation: string, id: string): Promise<string|null> => {
    try {
        const response = await fetch(`${base}/recovery?id=${id}&team=${congregation}`, {
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

export const getUserByTokenService = async (token: string = ''): Promise<{ user: typeUser|false|null, config: typeConfig|null }> => {
    if (!getTokenFromLSService()) return { user: false, config: null }
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers: !!token ? { ...getHeaders(), 'x-Authorization': token } : getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data) return { user: false, config: null }
        if (!data.config) {
            data.config = unauthenticatedConfig
        }
        if (!data?.success || !data?.user) {
            if (data && !data.success) removeTokenFromLSService()
            return { user: false, config: data.config }
        }
        data.user.isAuth = true
        data.user.isAdmin = data.user.role === 1
        data.user.isBuildingManager = data.user.role === 2
        setUserToLSService(data.user)
        return {
            user: data.user,
            config: data.config
        }
    } catch (error) {
        console.log(error)
        return { user: null, config: null }
    }
}

export const getUsersService = async (): Promise<typeUser[]|null> => {
    if (!getTokenFromLSService()) return null
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
        if (!!data?.success && !!data?.newToken) setTokenToLSService(data.newToken)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const logoutAllService = async (): Promise<boolean> => {
    if (!getTokenFromLSService()) return false
    try {
        const response = await fetch(`${base}/token`, {
            method: 'DELETE',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.newToken) return false
        setTokenToLSService(data.newToken)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const logoutService = (): void => {
    removeTokenFromLSService()
}

export const registerUserService = async (team: number, email: string, id: string, password: string, recaptchaToken: string): Promise<typeResponseData|null> => {
    try {
        const response = await fetch(base, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, id, password, recaptchaToken, team })
        })
        const data: typeResponseData = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const registerUserAdminsService = async (email: string, password: string): Promise<typeResponseData|null> => {
    try {
        const response = await fetch(base, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password })
        })
        const data: typeResponseData = await response.json()
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
