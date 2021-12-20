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
    console.log("data:", data)
    if (!data || !data.success || !data.hthTerritory || !data.hthTerritory.length) return null
    return data.hthTerritory
}

export const addBuildingService = async (territory: string,
     calle: string, numero: number, payloads: typeHTHHousehold[]): Promise<typeHTHBuilding[]|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const response: any|null = await fetch(`${base}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ territory, calle, numero, payloads })
    })
    const data: any|null = await response.json()
    if (!data || !data.success || !data.hthTerritory) return null
    return data.hthTerritory
}

export const modifyHTHHouseholdStateService = async (household: typeHTHHousehold, buildingId:string): Promise<boolean> => {
    const token: string|null = getToken()
    if (!token) return false
    const response: any|null = await fetch(`${base}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ household, buildingId })
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
    console.log("Streets:", data.streets.length)
    return data.streets
}
