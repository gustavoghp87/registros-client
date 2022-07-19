import { SERVER } from '../config'
import { getTokenService, headers } from './'
import { typeCoords, typeResponseData } from '../models'

const base: string = `${SERVER}/api/geocoding`

export const getGeocodingFromAddressService = async (address: string): Promise<typeCoords|null> => {
    if (!getTokenService() || !address) return null
    try {
        const response = await fetch(`${base}/address`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ address })
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success || !data.coordinates) return null
        return data.coordinates
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getGeocodingFromCoordinatesService = async (coordinates: typeCoords): Promise<string|null> => {
    if (!getTokenService() || !coordinates || !coordinates.lat || !coordinates.lng) return null
    try {
        const response = await fetch(`${base}/coordinates`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ coordinates })
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success || !data.address) return null
        return data.address
    } catch (error) {
        console.log(error)
        return null
    }
}
