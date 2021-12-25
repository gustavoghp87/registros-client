import { SERVER } from "../config"
import { typeHTHBuilding, typeHTHHousehold } from "../models/houseToHouse"
import { getToken, headers } from "./functions"

const base: string = `${SERVER}/api/house-to-house`

export const getBuildingsService = async (territory: string): Promise<typeHTHBuilding[]|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const response: any|null = await fetch(`${base}/${territory}`, {
        method: 'GET',
        headers
    })
    const data: any|null = await response.json()
    //console.log("data:", data)
    if (!data || !data.success || !data.hthTerritory || !data.hthTerritory.length) return null
    return data.hthTerritory
}

export type responseType = {
    success: boolean
    hthTerritory?: typeHTHBuilding[]
    exists?: boolean
}
export const addBuildingService = async (building: typeHTHBuilding): Promise<responseType|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const response: any|null = await fetch(`${base}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ building })
    })
    const data: responseType|null = await response.json()
    // if (!data || !data.success || !data.hthTerritory) return null
    return data
}

export const modifyHTHHouseholdStateService = async (household: typeHTHHousehold, buildingId:string): Promise<boolean> => {
    const token: string|null = getToken()
    if (!token) return false
    const response: any|null = await fetch(`${base}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ household, buildingId })
    })
    const data: any|null = await response.json()
    if (!data || !data.success) return false
    return true
}

export const modifyHTHBuildingService = async (building: typeHTHBuilding): Promise<boolean> => {
    const token: string|null = getToken()
    if (!token) return false
    const response: any|null = await fetch(`${base}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ building })
    })
    const data: any|null = await response.json()
    if (!data || !data.success) return false
    return true
}

export const getTerritoryStreetsService = async (territory: string): Promise<string[]|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const response: any|null = await fetch(`${base}/streets/${territory}`, {
        method: 'GET',
        headers
    })
    const data: any|null = await response.json()
    if (!data || !data.success || !data.streets) return null
    //console.log("Streets:", data.streets.length)
    return data.streets
}
