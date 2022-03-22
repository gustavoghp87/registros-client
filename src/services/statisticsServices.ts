import { SERVER } from '../config'
import { headers } from './functions'
import { getTokenService } from './tokenServices'
import { localStatistic, statistic } from '../models/statistic'

const base: string = `${SERVER}/api/statistic`

export const getNumberOfFreePhonesService = async (territory: string): Promise<number|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/free/${territory}`, {
            method: 'GET',
            headers
        })
        const data: any = await response?.json()
        if (!data || !data.success || data.data === undefined) return null
        return data.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getLocalStatisticsService = async (territory: string): Promise<localStatistic|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/${territory}`, {
            method: 'GET',
            headers
        })
        const data: any = await response?.json()
        if (!data || !data.success || !data.data) return null
        return data.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getAllLocalStatisticsService = async (): Promise<localStatistic[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}`, {
            method: 'GET',
            headers
        })
        const data: any = await response.json()
        if (!data || !data.success || !data.data) return null
        return data.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getGlobalStatisticsService = async (): Promise<statistic|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}`, {
            method: 'POST',
            headers
        })
        const data: any = await response.json()
        if (!data || !data.success || !data.data) return null
        return data.data
    } catch (error) {
        console.log(error)
        return null
    }
}
