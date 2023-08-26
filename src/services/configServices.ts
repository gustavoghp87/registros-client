import { getHeaders } from '.'
import { getTokenService } from './userServices'
import { pointer } from '../app-config'
import { typeResponseData } from '../models'

const base: string = pointer.config

export const inviteNewUserService = async (email: string): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(`${base}/invite`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ email })
        })
        const data: typeResponseData = await response.json()
        return !!data?.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const setCongregationNameService = async (name: string): Promise<boolean> => {
    if (!getTokenService() || !name) return false
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ name })
        })
        const data: typeResponseData|null = await response.json()
        if (!data?.success) return false
        return data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const setGoogleBoardUrlService = async (googleBoardUrl: string): Promise<boolean> => {
    if (!getTokenService() || !googleBoardUrl) return false
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ googleBoardUrl })
        })
        const data: typeResponseData|null = await response.json()
        if (!data?.success) return false
        return data.success
    } catch (error) {
        console.log(error)
        return false
    }
}
