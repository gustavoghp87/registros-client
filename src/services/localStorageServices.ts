import { typeConfig, typeUser } from '../models'

// token

export const getTokenFromLSService = (): string|null => localStorage.getItem('token')
export const removeTokenFromLSService = (): void => localStorage.removeItem('token')
export const setTokenToLSService = (token: string) => localStorage.setItem('token', token)

// dark mode

export const getDarkModeFromLSService = (): boolean => localStorage.getItem('darkMode') === 'true'
export const setDarkModeToLSService = (darkMode: boolean): void => localStorage.setItem('darkMode', (!!darkMode).toString())

// failing email

export const getFailingEmailFromLSService = (): string|null => localStorage.getItem('failingEmail')
export const removeFailingEmailFromLSService = (): void => localStorage.removeItem('failingEmail')
export const setFailingEmailToLSService = (failingEmail: string) => localStorage.setItem('failingEmail', failingEmail)

// config

export const getConfigFromLSService = (): typeConfig|null => {
    const ls = localStorage.getItem('mw-config')
    if (!ls) return null
    try {
        const config = JSON.parse(ls) as typeConfig
        return config
    } catch (error) {
        console.log("No se pudo parsear Config");
        return null
    }
}
export const setConfigToLSService = (config: typeConfig) => localStorage.setItem('mw-config', JSON.stringify(config))

// user

export const getUserFromLSService = (): typeUser|null => {
    const ls = localStorage.getItem('user')
    if (!ls) return null
    try {
        const user = JSON.parse(ls) as typeUser
        return user
    } catch (error) {
        console.log("No se pudo parsear User");
        return null
    }
}
export const setUserToLSService = (user: typeUser) => localStorage.setItem('user', JSON.stringify(user))
