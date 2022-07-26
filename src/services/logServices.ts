import { SERVER } from '../config'
import { headers } from './'
import { getTokenService } from './userServices'
import { typeLogsObj, typeResponseData } from '../models'

const base: string = `${SERVER}/api/log`

export const getAllLogsService = async (): Promise<typeLogsObj|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.logsObject) return null
        return data.logsObject
    } catch (error) {
        console.log(error)
        return null
    }
}
