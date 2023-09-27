import { getHeaders } from './'
import { getTokenFromLSService } from './localStorageServices'
import { pointer } from '../app-config'
import { typeCoords, typeResponseData } from '../models'

const base: string = pointer.geocoding

export const getCoordinatesFromAddressService = async (address: string): Promise<typeCoords|null> => {
    if (!getTokenFromLSService() || !address) return null
    try {
        const response = await fetch(`${base}/address`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ address })
        })
        const data: typeResponseData|null = await response.json()
        if (!data?.success || !data?.coordinates) return null
        return data.coordinates
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getAddressFromCoordinatesService = async (coordinates: typeCoords): Promise<string|null> => {
    if (!getTokenFromLSService() || !coordinates || !coordinates.lat || !coordinates.lng) return null
    try {
        const response = await fetch(`${base}/coordinates`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ coordinates })
        })
        const data: typeResponseData|null = await response.json()
        if (!data?.success || !data?.address) return null
        return data.address
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getStreetFromCoordinatesService = async (coordinates: typeCoords): Promise<string|null> => {
    if (!getTokenFromLSService() || !coordinates || !coordinates.lat || !coordinates.lng) return null
    try {
        const response = await fetch(`${base}/street`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ coordinates })
        })
        const data: typeResponseData|null = await response.json()
        if (!data?.success || !data?.street) return null
        return data.street
    } catch (error) {
        console.log(error)
        return null
    }
}