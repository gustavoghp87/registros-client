import { SERVER } from '../config'
import { headers } from './functions'
import { getTokenService } from './tokenServices'
import { typeHousehold } from '../models/typesTerritorios'

const base: string = `${SERVER}/api/territory`

export const getBlocksService = async (territory: string): Promise<string[]|null> => {
    if (!getTokenService()) return null
    try {
        const response: any = await fetch(`${base}/blocks/${territory}`, {
            method: 'GET',
            headers: headers
        })
        const data: any = await response?.json()
        if (!data || !data.success || !data.blocks) return null
        return data.blocks
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getHouseholdsByTerritoryService = async (territory: string, manzana: string, aTraer: number, traerTodos: boolean): Promise<[typeHousehold[], boolean]|null> => {
   if (!getTokenService()) return null
   try {
    const request: any = await fetch(`${base}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ territory, manzana, aTraer, traerTodos })
    })
    const response: any = await request.json()
    if (!response || !response.success || !response.households) return null
    return [response.households, response.isAll]
    } catch (error) {
        console.log(error)
        return null
    }
}

export const modifyHouseholdService = async (inner_id: string, estado: string, noAbonado: boolean, asignado: boolean): Promise<typeHousehold|null> => {
    if (!getTokenService()) return null
    try {
        const request: any = await fetch(`${base}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ inner_id, estado, noAbonado, asignado })
        })
        const response: any = await request.json()
        if (!response || !response.success || !response.households) return null
        return response.households
    } catch (error) {
        console.log(error)
        return null
    }
}

export const resetTerritoryService = async (territory: string, option: number): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const request: any = await fetch(`${base}`, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify({ territory, option })
        })
        const response: any = await request.json()
        if (!response || !response.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
