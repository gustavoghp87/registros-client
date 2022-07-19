import { SERVER } from '../config'
import { getTokenService, headers } from './'
import { typeResponseData, typeStateOfTerritory } from '../models'

const base: string = `${SERVER}/api/state-territory`

export const getStateOfTerritoryService = async (territorio: string): Promise<any> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/${territorio}`, {
            method: 'GET',
            headers
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.stateOfTerritory || data.stateOfTerritory.isFinished === null
            || typeof data.stateOfTerritory.isFinished !== "boolean") return null
        return data.stateOfTerritory
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getStateOfTerritoriesService = async (): Promise<typeStateOfTerritory[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.stateOfTerritories) return null
        return data.stateOfTerritories
    } catch (error) {
        console.log(error)
        return null
    }
}

export const markTerritoryAsFinishedService = async (territory: string, isFinished: boolean): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ territory, isFinished })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
