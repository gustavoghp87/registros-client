import { pointer } from '../config'
import { getHeaders } from '.'
import { getTokenService } from './userServices'
import { typeBlock, typeDoNotCall, typeFace, typeHTHBuilding, typeHTHMap, typeHTHTerritory, typeObservation, typePolygon, typeResponseData, typeTerritoryNumber } from '../models'

const base: string = pointer.houseToHouse

export const addHTHDoNotCallService = async (territory: typeTerritoryNumber,
 block: typeBlock, face: typeFace, polygonId: number, doNotCall: typeDoNotCall): Promise<boolean> => {
    if (!getTokenService() || !territory || !block || !face || !polygonId || !doNotCall) return false
    try {
        const response = await fetch(`${base}/do-not-call/${territory}/${block}/${face}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ doNotCall, polygonId })
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const addHTHObservationService = async (territoryNumber: typeTerritoryNumber,
 block: typeBlock, face:typeFace, polygonId: number, observation: typeObservation): Promise<boolean> => {
    if (!getTokenService() || !territoryNumber || !block || !face || !polygonId || !observation) return false
    try {
        const response = await fetch(`${base}/observation/${territoryNumber}/${block}/${face}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ observation, polygonId })
        })
        const data: typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const addHTHPolygonFaceService = async (territoryNumber: typeTerritoryNumber, polygon: typePolygon): Promise<boolean> => {
    if (!getTokenService() || !territoryNumber || !polygon) return false
    try {
        const response = await fetch(`${base}/map/${territoryNumber}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ polygon })
        })
        const data: typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const createHTHTerritoriesService = async (): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(`${base}/genesys`, {
            method: 'POST',
            headers: getHeaders()
        })
        const data: typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const deleteHTHPolygonFaceService = async (
 territoryNumber: typeTerritoryNumber, block: typeBlock, face: typeFace, faceId: number): Promise<boolean> => {
    if (!getTokenService() || !territoryNumber || !block || !face || !faceId) return false
    try {
        const response = await fetch(`${base}/map/${territoryNumber}/${block}/${face}`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ faceId })
        })
        const data: typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const deleteHTHDoNotCallService = async (
 territoryNumber: typeTerritoryNumber, block: typeBlock, face: typeFace, doNotCallId: number): Promise<boolean> => {
    if (!getTokenService() || !territoryNumber || !block || !face || !doNotCallId) return false
    try {
        const response = await fetch(`${base}/do-not-call/${territoryNumber}/${block}/${face}`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ doNotCallId })
        })
        const data: typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const deleteHTHObservationService = async (
 territoryNumber: typeTerritoryNumber, block: typeBlock, face:typeFace, observationId: number): Promise<boolean> => {
    if (!getTokenService() || !territoryNumber || !block || !face || !observationId) return false
    try {
        const response = await fetch(`${base}/observation/${territoryNumber}/${block}/${face}`, {
            method: 'DELETE',
            headers: getHeaders(),
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

export const editHTHObservationService = async (
    territoryNumber: typeTerritoryNumber, block: typeBlock, face:typeFace, observation: typeObservation): Promise<boolean> => {
    if (!getTokenService() || !territoryNumber || !block || !face || !observation) return false
    try {
        const response = await fetch(`${base}/observation/${territoryNumber}/${block}/${face}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ observation })
        })
        const data: typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const editHTHMapService = async (territoryNumber: typeTerritoryNumber,
    editedHTHMap: typeHTHMap, editedHTHPolygons: typePolygon[]): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(`${base}/map/${territoryNumber}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ editedHTHMap, editedHTHPolygons })
        })
        const data: typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const getHTHTerritoryService = async (territoryNumber: string): Promise<typeHTHTerritory|null> => {
    if (!territoryNumber) return null   // not !getTokenService()
    try {
        const response = await fetch(`${base}/${territoryNumber}`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success || !data.hthTerritory) return null
        return data.hthTerritory
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getHTHStreetsByTerritoryService = async (territoryNumber: typeTerritoryNumber): Promise<string[]|null> => {
    if (!getTokenService() || !territoryNumber) return null
    try {
        const response = await fetch(`${base}/street/${territoryNumber}`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success || !data.streets) return null
        return data.streets
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getHTHTerritoriesForMapService = async (): Promise<typeHTHTerritory[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/map/territory`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success || !data.hthTerritories) return null
        return data.hthTerritories
    } catch (error) {
        console.log(error)
        return null
    }
}

export const setHTHIsFinishedService = async (territoryNumber: typeTerritoryNumber, block: typeBlock|null,
 face: typeFace|null, polygonId: number|null, isFinish: boolean, isAll: boolean = false): Promise<boolean> => {
    if (!getTokenService() || !territoryNumber || isFinish === undefined) return false
    try {
        const response = await fetch(`${base}/state/${territoryNumber}/${block}/${face}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ isFinish, polygonId, isAll })
        })
        const data: typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}


//////// BUILDINGS

type addBuildingServiceResponse = {
    success: boolean
    dataError: boolean
    alreadyExists: boolean
}

export const addBuildingService = async (
 territoryNumber: typeTerritoryNumber, block: typeBlock, face: typeFace, newBuilding: typeHTHBuilding): Promise<addBuildingServiceResponse|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/building/${territoryNumber}/${block}/${face}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ newBuilding })
        })
        const data: typeResponseData|null = await response.json()
        if (!data) return null
        return {
            success: !!data.success,
            alreadyExists: !!data.alreadyExists,
            dataError: !!data.dataError
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

export const deleteHTHBuildingService = async (
 territoryNumber: typeTerritoryNumber, block: typeBlock, face: typeFace, streetNumber: number): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(`${base}/building/${territoryNumber}/${block}/${face}`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ streetNumber })
        })
        const data: typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const modifyHTHHouseholdService = async (territoryNumber: typeTerritoryNumber,
 block: typeBlock, face: typeFace, streetNumber: number, householdId: number, isChecked: boolean): Promise<boolean> => {
    if (!territoryNumber) return false   // not !getTokenService()
    try {
        const response = await fetch(`${base}/building/${territoryNumber}/${block}/${face}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ householdId, isChecked, streetNumber })
        })
        const data: typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const setHTHIsSharedBuildingsService = async (territoryNumber: typeTerritoryNumber,
 block: typeBlock, face: typeFace, polygonId: number, streetNumbers: number[]): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(`${base}/building/${territoryNumber}/${block}/${face}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ polygonId, streetNumbers })
        })
        const data: typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}
