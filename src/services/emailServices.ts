import { Credentials } from 'google-auth-library'
import { pointer } from '../config'
import { getHeaders } from '.'
import { getTokenService } from './userServices'
import { typeResponseData } from '../models'

const base: string = pointer.email

export const getGmailUrlService = async (): Promise<string|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success || !data.url) return null
        return data.url
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getGmailRequestService = async (code: string): Promise<Credentials|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ code })
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success || !data.gmailKeys) return null
        return data.gmailKeys
    } catch (error) {
        console.log(error)
        return null
    }
}

export const saveNewGmailAPITokenToDBService = async (accessToken: string, refreshToken: string): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(base, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ accessToken, refreshToken })
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}