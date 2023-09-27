import { getHeaders } from '.'
import { getTokenFromLSService } from './localStorageServices'
import { pointer } from '../app-config'
import { typeAllLogsObj, typeResponseData } from '../models'

const base: string = pointer.log

export const getAllLogsService = async (): Promise<typeAllLogsObj|null> => {
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.allLogsObj) return null
        return data.allLogsObj
    } catch (error) {
        console.log(error)
        return null
    }
}
