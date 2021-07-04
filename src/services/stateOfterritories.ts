import { SERVER } from '../config'
import { getToken } from './getToken'

export const getStateOfTerritories = async (territorio:string) => {
    const request = await fetch(SERVER + `/api/territories/${territorio}`)
    const json = await request.json()
    if (!json.obj || json.obj.estado === null || json.obj.estado === undefined) return null
    return json.obj.estado
}

export const checkTerritorioAsFinished = async (territorio:string, estado:boolean) => {
    const request = await fetch(SERVER + "/api/territories", {
        method: 'PATCH',
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify({ territorio, estado, token: getToken() })
    })
    const json = await request.json()
    return json.success
}
