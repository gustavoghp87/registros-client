import { SERVER } from '../config'
import { headers } from './functions'
import { getTokenService } from './tokenServices'
import { typeResponseData } from '../models/httpResponse'
import { typeBlock, typeTerritoryNumber } from '../models/territory'
import { typeDoNotCall, typeFace, typeHTHTerritory, typeObservation } from '../models/houseToHouse'

const base: string = `${SERVER}/api/house-to-house`

export const getHTHTerritoryService = async (territory: string): Promise<typeHTHTerritory|null> => {
    if (!getTokenService() || !territory) return null
    try {
        const response = await fetch(`${base}/${territory}`, {
            method: 'GET',
            headers
        })
        const data: any = await response.json()
        if (!data || !data.success || !data.hthTerritory) return null
        return data.hthTerritory
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getHTHStreetsByTerritoryService = async (territory: typeTerritoryNumber): Promise<string[]|null> => {
    if (!getTokenService() || !territory) return null
    try {
        const response = await fetch(`${base}/street/${territory}`, {
            method: 'GET',
            headers
        })
        const data: any = await response.json()
        if (!data || !data.success) return null
        return data.streets
    } catch (error) {
        console.log(error)
        return null
    }
}

export const addHTHDoNotCallService = async (doNotCall: typeDoNotCall, territory: typeTerritoryNumber): Promise<boolean> => {
    if (!getTokenService() || !territory || !doNotCall) return false
    try {
        const response = await fetch(`${base}/do-not-call/${territory}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ doNotCall })
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const addHTHObservationService = async (observation: typeObservation, territory: typeTerritoryNumber): Promise<boolean> => {
    if (!getTokenService() || !territory || !observation) return false
    try {
        const response = await fetch(`${base}/observation/${territory}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ observation })
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const deleteHTHDoNotCallService = async (doNotCallId: number, territory: typeTerritoryNumber): Promise<boolean> => {
    if (!getTokenService() || !territory || !doNotCallId) return false
    try {
        const response = await fetch(`${base}/do-not-call/${territory}`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({ doNotCallId })
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const deleteHTHObservationService = async (observationId: number, territory: typeTerritoryNumber): Promise<boolean> => {
    if (!getTokenService() || !territory || !observationId) return false
    try {
        const response = await fetch(`${base}/observation/${territory}`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({ observationId })
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const editHTHObservationService = async (observation: typeObservation, territory: typeTerritoryNumber): Promise<boolean> => {
    if (!getTokenService() || !territory || !observation) return false
    try {
        const response = await fetch(`${base}/observation/${territory}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ observation })
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const setHTHIsFinishedService = async (isFinish: boolean, block: typeBlock, face: typeFace, territory: typeTerritoryNumber): Promise<boolean> => {
    if (!getTokenService() || !territory || isFinish === undefined) return false
    try {
        const response = await fetch(`${base}/state/${territory}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ isFinish, block, face })
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
