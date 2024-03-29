import { getHeaders } from '.'
import { getTokenFromLSService } from './localStorageServices'
import { pointer } from '../app-config'
import * as types from '../models'

const base: string = pointer.telephonic

export const changeStateOfTerritoryService = async (territoryNumber: string, isFinished: boolean): Promise<boolean> => {
    if (!getTokenFromLSService()) return false
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ territoryNumber, isFinished })
        })
        const data: types.typeResponseData = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const getGlobalStatisticsService = async (): Promise<types.typeTelephonicStatistic|null> => {
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(`${base}/statistic/global`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: types.typeResponseData = await response.json()
        if (!data || !data.success || !data.globalStatistics) return null
        return data.globalStatistics
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getGlobalStatistics1Service = async (): Promise<types.typeTerritoryRow[]|null> => {
    try {
        if (!getTokenFromLSService()) throw new Error("Sin Token")
        const response = await fetch(`${base}/statistics/table`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: types.typeResponseData = await response.json()
        if (!data || !data.success || !data.territoriesTableData) return null
        return data.territoriesTableData
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getTLPTerritoryService = async (territoryNumber: string): Promise<types.typeTelephonicTerritory|null> => {
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(`${base}/${territoryNumber}`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: types.typeResponseData = await response.json()
        if (!data || !data.success || !data.telephonicTerritory) return null
        return data.telephonicTerritory
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getLocalStatisticsService = async (): Promise<types.typeLocalTelephonicStatistic[]|null> => {
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(`${base}/statistic/local`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: types.typeResponseData = await response.json()
        if (!data || !data.success || !data.localStatistics) return null
        return data.localStatistics
    } catch (error) {
        console.log(error)
        return null
    }
}

export const modifyHouseholdService = async (territoryNumber: types.typeTerritoryNumber,
 householdId: number, callingState: string, notSubscribed: boolean, isAssigned: boolean): Promise<types.typeHousehold|null> => {
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(`${base}/${territoryNumber}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ householdId, callingState, notSubscribed, isAssigned })
        })
        const data: types.typeResponseData = await response.json()
        if (!data || !data.success || !data.household) return null
        return data.household
    } catch (error) {
        console.log(error)
        return null
    }
}

export const resetTerritoryService = async (territoryNumber: string, option: number): Promise<number|null> => {
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(base, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ territoryNumber, option })
        })
        const data: types.typeResponseData = await response.json()
        if (!data || !data.success || data.modifiedCount === null || data.modifiedCount === undefined) return null
        return data.modifiedCount
    } catch (error) {
        console.log(error)
        return null
    }
}
