import { getHeaders } from '.'
import { getTokenService } from './userServices'
import { pointer } from '../app-config'
import { typeResponseData } from '../models'

const base: string = pointer.config

export const sendInvitationForNewUserService = async (email: string, newCongregation: boolean = false): Promise<typeResponseData|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/invite`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ email, newCongregation })
        })
        const data: typeResponseData = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return null
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
        return !!data?.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const setDisableEditMapsService = async (disableEditMaps: boolean): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ disableEditMaps })
        })
        const data: typeResponseData|null = await response.json()
        return !!data?.success
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
        return !!data?.success
    } catch (error) {
        console.log(error)
        return false
    }
}
