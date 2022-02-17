import { SERVER } from "../config"
import { typeVivienda } from "../models/typesTerritorios"
import { getToken, headers } from "./functions"

const base: string = `${SERVER}/api/territory`

export const getBlocksService = async (territory: string): Promise<string[]|null> => {
    const token: string|null = getToken()
    if (!token) return null
    try {
        const response: any|null = await fetch(`${base}/blocks/${territory}`, {
            method: 'GET',
            headers: headers
        })
        const data: any|null = await response?.json()
        if (!data || !data.success || !data.blocks) return null
        return data.blocks
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getHouseholdsByTerritoryService = async (territory: string,
    manzana: string, isTodo: boolean, traidos: number, traerTodos: boolean): Promise<typeVivienda[]|null> => {
   const token: string|null = getToken()
   if (!token) return null
   try {
    const request: any|any = await fetch(`${base}/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ territory, manzana, isTodo, traidos, traerTodos })
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.households) return null
    return response.households
    } catch (error) {
        console.log(error)
        return null
    }
}

export const modifyHouseholdService = async (inner_id: string,
     estado: string, noAbonado: boolean, asignado: boolean): Promise<typeVivienda|null> => {
    const token: string|null = getToken()
    if (!token) return null
    try {
        const request: any|null = await fetch(`${base}/`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ inner_id, estado, noAbonado, asignado })
        })
        const response: any|null = await request.json()
        if (!response || !response.success || !response.households) return null
        return response.households
    } catch (error) {
        console.log(error)
        return null
    }
}

export const resetTerritoryService = async (territory: string, option: number): Promise<boolean> => {
    const token: string|null = getToken()
    if (!token) return false
    try {
        const request: any|null = await fetch(`${base}/`, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify({ territory, option })
        })
        const response: any|null = await request.json()
        if (!response || !response.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
