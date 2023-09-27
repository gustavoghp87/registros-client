import { getHeaders } from '.'
import { getTokenFromLSService } from './localStorageServices'
import { pointer } from '../app-config'
import { typeBoardItem, typeResponseData } from '../models'

const base: string = pointer.board

export const getBoardItemsService = async (): Promise<typeBoardItem[]|null> => {
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData|null = await response.json()
        if (!data?.success || !data?.boardItems) return null
        return data.boardItems
    } catch (error) {
        console.log(error)
        return null
    }
}
