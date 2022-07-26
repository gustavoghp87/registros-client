import { SERVER } from '../config'
import { headers } from './'
import { getTokenService } from './userServices'
import { typeLocalStatistic, typeResponseData, typeStatistic } from '../models'

const base: string = `${SERVER}/api/statistic`

export const getNumberOfFreePhonesService = async (territory: string): Promise<number|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/free/${territory}`, {
            method: 'GET',
            headers
        })
        const data: typeResponseData = await response?.json()
        if (!data || !data.success || data.numberOfFreePhones === undefined) return null
        return data.numberOfFreePhones
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getLocalStatisticsService = async (territory: string): Promise<typeLocalStatistic|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/${territory}`, {
            method: 'GET',
            headers
        })
        const data: typeResponseData = await response?.json()
        if (!data || !data.success || !data.localStatistic) return null
        return data.localStatistic
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getAllLocalStatisticsService = async (): Promise<typeLocalStatistic[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.localStatistics) return null
        return data.localStatistics
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getGlobalStatisticsService = async (): Promise<typeStatistic|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'POST',
            headers
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.statistic) return null
        return data.statistic
    } catch (error) {
        console.log(error)
        return null
    }
}
