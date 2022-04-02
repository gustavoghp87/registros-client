import { SERVER } from '../config'
import { headers } from './functions'
import { getTokenService } from './tokenServices'
import { typeBlock, typeHousehold } from '../models/territory'
import { typeResponseData } from '../models/httpResponse'

const base: string = `${SERVER}/api/territory`

export const getBlocksService = async (territory: string): Promise<typeBlock[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/blocks/${territory}`, {
            method: 'GET',
            headers
        })
        const data: typeResponseData = await response?.json()
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
    const response = await fetch(base, {
        method: 'POST',
        headers,
        body: JSON.stringify({ territory, manzana, aTraer, traerTodos })
    })
    const data: typeResponseData = await response.json()
    if (!data || !data.success || !data.households) return null
    data.isAll = !data.isAll ? false : true
    return [data.households, data.isAll]
    } catch (error) {
        console.log(error)
        return null
    }
}

export const modifyHouseholdService = async (inner_id: string, estado: string, noAbonado: boolean, asignado: boolean): Promise<typeHousehold|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ inner_id, estado, noAbonado, asignado })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.household) return null
        return data.household
    } catch (error) {
        console.log(error)
        return null
    }
}

export const resetTerritoryService = async (territory: string, option: number): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(base, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({ territory, option })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
