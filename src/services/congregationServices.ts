import { pointer } from '../config'
import { getHeaders } from '.'
import { getTokenService } from './userServices'
import { typeCongregationItem, typeResponseData } from '../models'

const base: string = pointer.congregation

export const getCongregationItems = async (): Promise<typeCongregationItem[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData|null = await response.json()
        if (!data || !data.success || !data.congregationItems) return null
        return data.congregationItems
    } catch (error) {
        console.log(error)
        return null
    }
}
