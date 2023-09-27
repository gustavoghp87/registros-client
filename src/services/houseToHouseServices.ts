import { getHeaders } from '.'
import { getTokenFromLSService } from './localStorageServices'
import { pointer } from '../app-config'
import * as types from '../models'

const base: string = pointer.houseToHouse

export const addHTHDoNotCallService = async (territory: types.typeTerritoryNumber,
 block: types.typeBlock, face: types.typeFace, polygonId: number, doNotCall: types.typeDoNotCall): Promise<boolean> => {
    if (!getTokenFromLSService() || !territory || !block || !face || !polygonId || !doNotCall) return false
    try {
        const response = await fetch(`${base}/do-not-call/${territory}/${block}/${face}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ doNotCall, polygonId })
        })
        const data: types.typeResponseData|null = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const addHTHObservationService = async (territoryNumber: types.typeTerritoryNumber,
 block: types.typeBlock, face:types.typeFace, polygonId: number, observation: types.typeObservation): Promise<boolean> => {
    if (!getTokenFromLSService() || !territoryNumber || !block || !face || !polygonId || !observation) return false
    try {
        const response = await fetch(`${base}/observation/${territoryNumber}/${block}/${face}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ observation, polygonId })
        })
        const data: types.typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const addHTHPolygonFaceService = async (territoryNumber: types.typeTerritoryNumber, polygon: types.typePolygon): Promise<boolean> => {
    if (!getTokenFromLSService() || !territoryNumber || !polygon) return false
    try {
        const response = await fetch(`${base}/map/${territoryNumber}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ polygon })
        })
        const data: types.typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const createHTHTerritoriesService = async (numberOfTerritories: number, lat: number, lng: number): Promise<boolean> => {
    if (!getTokenFromLSService() || !numberOfTerritories || !lat || !lng) return false
    try {
        const response = await fetch(`${base}/genesys`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ numberOfTerritories, lat, lng })
        })
        const data: types.typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const deleteHTHPolygonFaceService = async (
 territoryNumber: types.typeTerritoryNumber, block: types.typeBlock, face: types.typeFace, faceId: number): Promise<boolean> => {
    if (!getTokenFromLSService() || !territoryNumber || !block || !face || !faceId) return false
    try {
        const response = await fetch(`${base}/map/${territoryNumber}/${block}/${face}`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ faceId })
        })
        const data: types.typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const deleteHTHDoNotCallService = async (
 territoryNumber: types.typeTerritoryNumber, block: types.typeBlock, face: types.typeFace, doNotCallId: number): Promise<boolean> => {
    if (!getTokenFromLSService() || !territoryNumber || !block || !face || !doNotCallId) return false
    try {
        const response = await fetch(`${base}/do-not-call/${territoryNumber}/${block}/${face}`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ doNotCallId })
        })
        const data: types.typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const deleteHTHObservationService = async (
 territoryNumber: types.typeTerritoryNumber, block: types.typeBlock, face:types.typeFace, observationId: number): Promise<boolean> => {
    if (!getTokenFromLSService() || !territoryNumber || !block || !face || !observationId) return false
    try {
        const response = await fetch(`${base}/observation/${territoryNumber}/${block}/${face}`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ observationId })
        })
        const data: types.typeResponseData|null = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const editHTHObservationService = async (
    territoryNumber: types.typeTerritoryNumber, block: types.typeBlock, face:types.typeFace, observation: types.typeObservation): Promise<boolean> => {
    if (!getTokenFromLSService() || !territoryNumber || !block || !face || !observation) return false
    try {
        const response = await fetch(`${base}/observation/${territoryNumber}/${block}/${face}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ observation })
        })
        const data: types.typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const editHTHMapService = async (territoryNumber: types.typeTerritoryNumber,
    editedHTHMap: types.typeHTHMap, editedHTHPolygons: types.typePolygon[]): Promise<boolean> => {
    if (!getTokenFromLSService()) return false
    try {
        const response = await fetch(`${base}/map/${territoryNumber}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ editedHTHMap, editedHTHPolygons })
        })
        const data: types.typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const getHTHBuildingService = async (congregation: number, territoryNumber: string,
 block: types.typeBlock, face: types.typeFace, streetNumber: number): Promise<types.typeResponseData|null> => {
    if (!congregation || !territoryNumber) return null   // not !getTokenFromLSService()
    try {
        const response = await fetch(`${base}/building/${congregation}/${territoryNumber}/${block}/${face}/${streetNumber}`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: types.typeResponseData|null = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}
export const setHTHIsFinishedService = async (territoryNumber: types.typeTerritoryNumber, block: types.typeBlock|null,
 face: types.typeFace|null, polygonId: number|null, isFinish: boolean, isAll: boolean = false): Promise<boolean> => {
    if (!getTokenFromLSService() || !territoryNumber || isFinish === undefined) return false
    try {
        const response = await fetch(`${base}/state/${territoryNumber}/${block}/${face}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ isFinish, polygonId, isAll })
        })
        const data: types.typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const getHTHStreetsByTerritoryService = async (territoryNumber: types.typeTerritoryNumber): Promise<string[]|null> => {
    if (!getTokenFromLSService() || !territoryNumber) return null
    try {
        const response = await fetch(`${base}/street/${territoryNumber}`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: types.typeResponseData|null = await response.json()
        if (!data || !data.success || !data.streets) return null
        return data.streets
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getHTHTerritoriesForStatisticsService = async (): Promise<types.typeHTHTerritory[]|null> => {
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(`${base}/map/territory-statistics`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: types.typeResponseData|null = await response.json()
        if (!data?.success || !data?.hthTerritories) return null
        return data.hthTerritories
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getHTHTerritoriesForMapService = async (): Promise<types.typeHTHTerritory[]|null> => {
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(`${base}/map/territory-map`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: types.typeResponseData|null = await response.json()
        if (!data?.success || !data?.hthTerritories) return null
        return data.hthTerritories
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getHTHTerritoryService = async (territoryNumber: string): Promise<types.typeHTHTerritory|null> => {
    if (!getTokenFromLSService() || !territoryNumber) return null
    try {
        const response = await fetch(`${base}/${territoryNumber}`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: types.typeResponseData|null = await response.json()
        if (!data?.success || !data?.hthTerritory) return null
        return data.hthTerritory
    } catch (error) {
        console.log(error)
        return null
    }
}

//////// BUILDINGS

type addBuildingServiceResponse = {
    success: boolean
    dataError: boolean
    alreadyExists: boolean
}

export const addBuildingService = async (territoryNumber: types.typeTerritoryNumber, block: types.typeBlock,
 face: types.typeFace, newBuilding: types.typeHTHBuilding): Promise<addBuildingServiceResponse|null> => {
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(`${base}/building/${territoryNumber}/${block}/${face}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ newBuilding })
        })
        const data: types.typeResponseData|null = await response.json()
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
 territoryNumber: types.typeTerritoryNumber, block: types.typeBlock, face: types.typeFace, streetNumber: number): Promise<boolean> => {
    if (!getTokenFromLSService()) return false
    try {
        const response = await fetch(`${base}/building/${territoryNumber}/${block}/${face}`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ streetNumber })
        })
        const data: types.typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const modifyHTHHouseholdService = async (congregation: number, territoryNumber: types.typeTerritoryNumber, block: types.typeBlock,
 face: types.typeFace, streetNumber: number, householdId: number, isChecked: boolean, isManager: boolean, street: string): Promise<boolean> => {
    if (!territoryNumber) return false   // not !getTokenFromLSService()
    try {
        const response = await fetch(`${base}/building/${congregation}/${territoryNumber}/${block}/${face}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ householdId, isChecked, isManager, street, streetNumber })
        })
        const data: types.typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}

export const setHTHIsSharedBuildingsService = async (territoryNumber: types.typeTerritoryNumber,
 block: types.typeBlock, face?: types.typeFace, polygonId?: number, streetNumbers?: number[]): Promise<boolean> => {
    if (!getTokenFromLSService()) return false
    try {
        const response = await fetch(`${base}/building/${territoryNumber}?block=${block}&face=${face ? face : ''}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ polygonId, streetNumbers })
        })
        const data: types.typeResponseData|null = await response.json()
        return !!data && !!data.success
    } catch (error) {
        console.log(error)
        return false
    }
}
