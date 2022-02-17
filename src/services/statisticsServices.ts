import { SERVER } from '../config'
import { localStatistic, statistic } from '../models/statistic'
import { getToken, headers } from './functions'

const base: string = `${SERVER}/api/statistic`

export const getLocalStatisticsService = async (territory: string): Promise<localStatistic|null> => {
    const token: string|null = getToken()
    if (!token) return null
    try {
        const request = await fetch(`${base}/${territory}`, {
            method: 'GET',
            headers: headers
        })
        const response: any|null = await request?.json()
        if (!response || !response.success || !response.data) return null
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getAllLocalStatisticsService = async (): Promise<localStatistic[]|null> => {
    const token: string|null = getToken()
    if (!token) return null
    try {
        const request = await fetch(`${base}/`, {
            method: 'GET',
            headers: headers
        })
        const response: any|null = await request.json()
        if (!response || !response.success || !response.data) return null
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getGlobalStatisticsService = async (): Promise<statistic|null> => {
    const token: string|null = getToken()
    if (!token) return null
    try {
        const request = await fetch(`${base}/`, {
            method: 'POST',
            headers: headers
        })
        const response: any|null = await request.json()
        if (!response || !response.success || !response.data) return null
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}
