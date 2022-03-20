import { SERVER } from '../config'
import { headers } from './functions'
import { getTokenService } from './tokenServices'
import { typeLogsObj } from '../models/log'

const base: string = `${SERVER}/api/log`

export const getAllLogsService = async (): Promise<typeLogsObj|null> => {
    if (!getTokenService()) return null
    try {
        const response: any = await fetch(`${base}`, {
            method: 'GET',
            headers
        })
        const data: any = await response.json()
        if (!data || !data.success || !data.logsObject) return null
        return data.logsObject
    } catch (error) {
        console.log(error)
        return null
    }
}
