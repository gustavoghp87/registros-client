import { getHeaders } from '.'
import { getTokenService } from './userServices'
import { pointer } from '../app-config'
import { typeBoardItem, typeResponseData } from '../models'

const base: string = pointer.board

export const getBoardItems = async (): Promise<typeBoardItem[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success || !data.boardItems) return null
        return data.boardItems
    } catch (error) {
        console.log(error)
        return null
    }
}
