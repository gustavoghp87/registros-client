import { getHeaders } from '.'
import { getTokenFromLSService } from './localStorageServices'
import { pointer } from '../app-config'
import { typeResponseData } from '../models'

const base: string = pointer.config

export const sendInvitationForNewUserService = async (email: string, newCongregation: boolean = false): Promise<typeResponseData|null> => {
    if (!getTokenFromLSService()) return null
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
    if (!getTokenFromLSService() || !name) return false
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

export const setDisableCloseHthFacesService = async (disableCloseHthFaces: boolean): Promise<boolean> => {
    if (!getTokenFromLSService()) return false
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ disableCloseHthFaces })
        })
        const data: typeResponseData|null = await response.json()
        return !!data?.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const setDisableHthBuildingsForUnassignedUsersService = async (disableHthBuildingsForUnassignedUsers: boolean): Promise<boolean> => {
    if (!getTokenFromLSService()) return false
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ disableHthBuildingsForUnassignedUsers })
        })
        const data: typeResponseData|null = await response.json()
        return !!data?.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const setDisableHthFaceObservatiosService = async (disableHthFaceObservations: boolean): Promise<boolean> => {
    if (!getTokenFromLSService()) return false
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ disableHthFaceObservations })
        })
        const data: typeResponseData|null = await response.json()
        return !!data?.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const setDisableEditMapsService = async (disableEditHthMaps: boolean): Promise<boolean> => {
    if (!getTokenFromLSService()) return false
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ disableEditHthMaps })
        })
        const data: typeResponseData|null = await response.json()
        return !!data?.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const setGoogleBoardUrlService = async (googleBoardUrl: string): Promise<boolean> => {
    if (!getTokenFromLSService() || !googleBoardUrl) return false
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

export const setUsingLettesForBlocksService = async (useLettersForBlocks: boolean): Promise<boolean> => {
    if (!getTokenFromLSService()) return false
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ useLettersForBlocks })
        })
        const data: typeResponseData|null = await response.json()
        return !!data?.success
    } catch (error) {
        console.log(error)
        return false
    }
}
