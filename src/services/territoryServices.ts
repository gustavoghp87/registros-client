import { SERVER } from '../config'
import { getTokenService, headers } from './'
import { typeBlock, typeHousehold, typeResponseData, typeStateOfTerritory } from '../models'

const base: string = `${SERVER}/api/territory`

const getBlocksByTerritory = (households: typeHousehold[]): typeBlock[] => {
    let blocks: typeBlock[] = []
    for (let i = 1; i < 10; i++) {
        let household: typeHousehold|undefined = households.find(x => x.manzana === i.toString())
        if (household) blocks.push(i.toString() as typeBlock)
    }
    return blocks
}

export const getHouseholdsByTerritoryService = async (
    territory: string): Promise<[typeHousehold[], typeBlock[], typeStateOfTerritory]|null> => {
    if (!getTokenService()) return null
    try {
    const response = await fetch(`${base}/${territory}`, {
        method: 'GET',
        headers
    })
    const data: typeResponseData = await response.json()
    if (!data || !data.success || !data.households || !data.stateOfTerritory) return null
    const blocks: typeBlock[] = getBlocksByTerritory(data.households)
    if (!blocks.length) return null
    return [data.households, blocks, data.stateOfTerritory]
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
