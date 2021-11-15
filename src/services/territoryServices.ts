import { SERVER } from "../config"
import { typeVivienda } from "../models/typesTerritorios"
import { getHeaders, getToken } from "./functions"

const base = `${SERVER}/api/territories`

export const modifyHouseholdService = async (inner_id: string,
     estado: string, noAbonado: boolean, asignado: boolean): Promise<typeVivienda|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request: any|null = await fetch(`${base}/modify-household`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token, inner_id, estado, noAbonado, asignado })
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.households) return null
    return response.households
}

export const getHouseholdsByTerritoryService = async (territory: string,
     manzana: string, isTodo: boolean, traidos: number, traerTodos: boolean): Promise<typeVivienda[]|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request: any|any = await fetch(`${base}/get-households`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token, territory, manzana, isTodo, traidos, traerTodos })
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.households) return null
    return response.households
}

export const getBlocksService = async (territory: string): Promise<string[]|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const response: any|null = await fetch(`${base}/get-blocks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token, territory })
    })
    const data: any|null = await response.json()
    if (!data || !data.success || !data.blocks) return null
    return data.blocks
}

export const resetTerritoryService = async (territory: string, option: number): Promise<boolean> => {
    const token: string|null = getToken()
    if (!token) return false
    const request: any|null = await fetch(`${base}/reset`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token, option, territory })
    })
    const response: any|null = await request.json()
    if (!response || !response.success) return false
    return true
}
