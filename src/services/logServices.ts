import { SERVER } from "../config"
import { typeLogsObj } from "../models/log"
import { getToken, headers } from "./functions"

const base: string = `${SERVER}/api/log`

export const getAllLogsService = async (): Promise<typeLogsObj|null> => {
    const token: string|null = getToken()
    if (!token) return null
    try {
        const response: any|null = await fetch(`${base}`, {
            method: 'GET',
            headers
        })
        const data: any|null = await response.json()
        console.log("data:", data)
        if (!data || !data.success || !data.logsObject) return null
        return data.logsObject
    } catch (error) {
        console.log(error)
        return null
    }
}
