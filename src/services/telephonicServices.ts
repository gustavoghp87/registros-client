import { pointer } from '../config'
import { getHeaders } from '.'
import { getTokenService } from './userServices'
import { typeHousehold, typeLocalTelephonicStatistic, typeResponseData, typeTelephonicStatistic, typeTelephonicTerritory, typeTerritoryNumber, typeTerritoryRow } from '../models'

const base: string = pointer.telephonic

export const changeStateOfTerritoryService = async (territoryNumber: string, isFinished: boolean): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ territoryNumber, isFinished })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const getGlobalStatisticsService = async (): Promise<typeTelephonicStatistic|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/statistic/global`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.globalStatistics) return null
        return data.globalStatistics
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getGlobalStatistics1Service = async (): Promise<typeTerritoryRow[]|null> => {
    const response = await fetch(`${base}/statistics/table`, {
        method: 'GET',
        headers: getHeaders()
    })
    const data: typeResponseData = await response.json()
    if (!data || !data.success || !data.territoriesTableData) return null
    return data.territoriesTableData
}

export const getTLPTerritoryService = async (territoryNumber: string): Promise<typeTelephonicTerritory|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/${territoryNumber}`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.telephonicTerritory) return null
        return data.telephonicTerritory
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getLocalStatisticsService = async (): Promise<typeLocalTelephonicStatistic[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/statistic/local`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.localStatistics) return null
        return data.localStatistics
    } catch (error) {
        console.log(error)
        return null
    }
}

export const modifyHouseholdService = async (territoryNumber: typeTerritoryNumber,
 householdId: number, callingState: string, notSubscribed: boolean, isAssigned: boolean): Promise<typeHousehold|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/${territoryNumber}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ householdId, callingState, notSubscribed, isAssigned })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.household) return null
        return data.household
    } catch (error) {
        console.log(error)
        return null
    }
}

export const resetTerritoryService = async (territoryNumber: string, option: number): Promise<number|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ territoryNumber, option })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || data.modifiedCount === null || data.modifiedCount === undefined) return null
        return data.modifiedCount
    } catch (error) {
        console.log(error)
        return null
    }
}
