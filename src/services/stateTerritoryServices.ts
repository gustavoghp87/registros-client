import { SERVER } from '../config'
import { stateOfTerritory } from '../models/typesTerritorios'
import { getToken, headers } from './functions'

const base: string = `${SERVER}/api/state-territory`

export const getStateOfTerritoryService = async (territorio: string): Promise<boolean|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request: any|null = await fetch(`${base}/${territorio}`, {
        method: 'GET',
        headers: headers
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.obj || response.obj.isFinished === null
        || typeof response.obj.isFinished !== "boolean") return null
    return response.obj.isFinished
}

export const getStateOfTerritoriesService = async (): Promise<stateOfTerritory[]|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request: any|null = await fetch(`${base}`, {
        method: 'GET',
        headers: headers
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.obj) return null
    const stateOfTerritories: stateOfTerritory[] = response.obj
    return stateOfTerritories
}

export const markTerritoryAsFinishedService = async (territory: string, isFinished: boolean): Promise<boolean> => {
    const token: string|null = getToken()
    if (!token) return false
    const request: any|null = await fetch(`${base}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ territory, isFinished })
    })
    const response: any|null = await request.json()
    if (!response || !response.success) return false
    return true
}
