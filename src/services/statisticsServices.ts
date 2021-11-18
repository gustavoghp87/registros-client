import { SERVER } from '../config'
import { localStatistic, statistic } from '../models/statistic'
import { getHeaders, getToken } from './functions'

const base: string = `${SERVER}/api/statistics`

export const getLocalStatisticsService = async (territory: string): Promise<localStatistic|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request = await fetch(`${base}/local`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token, territory })
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.data) return null
    return response.data
}

export const getAllLocalStatisticsService = async (): Promise<localStatistic[]|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request = await fetch(`${base}/local-all`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token })
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.data) return null
    return response.data
}

export const getGlobalStatisticsService = async (): Promise<statistic|null> => {
    const token: string|null = getToken()
    if (!token) return null
    const request = await fetch(`${base}/global`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token })
    })
    const response: any|null = await request.json()
    if (!response || !response.success || !response.data) return null
    return response.data
}
