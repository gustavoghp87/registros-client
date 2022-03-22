import { SERVER } from '../config'
import { headers } from './functions'
import { getTokenService } from './tokenServices'
import { typeCampaignPack } from '../models/campaign'

const base: string = `${SERVER}/api/campaign`

type campaignResponse = {
    success: boolean
    packs: typeCampaignPack[]
}
type campaignResponse1 = {
    success: boolean
    pack: typeCampaignPack
}

export const getCampaignPacksService = async (): Promise<typeCampaignPack[]|null> => {
    if (!getTokenService()) return null
    try {
        const response: any = await fetch(`${base}/all`, {
            method: 'GET',
            headers
        })
        const data: campaignResponse|null = await response?.json()
        if (!data || !data.success || !data.packs) return null
        return data.packs
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getCampaignPacksServiceByUser = async (): Promise<typeCampaignPack[]|null> => {
    if (!getTokenService()) return null
    try {
        const response: any = await fetch(`${base}`, {
            method: 'GET',
            headers
        })
        const data: campaignResponse|null = await response?.json()
        if (!data || !data.success || !data.packs) return null
        return data.packs
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getCampaignPackService = async (id: number): Promise<typeCampaignPack|null> => {
    // if (!getTokenService() || !id) return null    accessible
    if (!id) return null
    try {
        const response: any = await fetch(`${base}/${id.toString()}`, {
            method: 'GET',
            headers
        })
        const data: campaignResponse1|null = await response?.json()
        if (!data || !data.success || !data.pack) return null
        return data.pack
    } catch (error) {
        console.log(error)
        return null
    }
}

export const editCampaignPackService = async (phoneNumber: number, checked: boolean, id: number): Promise<boolean> => {
    // if (!getTokenService() || !phoneNumber || checked === undefined) return false    accessible
    if (!phoneNumber || checked === undefined) return false
    try {
        const response: any = await fetch(`${base}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ phoneNumber, id, checked })
        })
        const data: any = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const closeCampaignPackService = async (id: number): Promise<boolean> => {
    // if (!getTokenService() || !id) return false    accessible
    if (!id) return false
    try {
        const response: any = await fetch(`${base}/all`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ id })
        })
        const data: any = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const assignCampaignPackByEmailService = async (id: number, email: string): Promise<boolean> => {
    if (!getTokenService() || !id || !email) return false
    try {
        const response: any = await fetch(`${base}/${id.toString()}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ email })
        })
        const data: any = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const askForANewCampaignPackService = async (): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response: any = await fetch(`${base}/new-pack`, {
            method: 'POST',
            headers
        })
        const data: any = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const enableAccesibilityModeService = async (id: number, accessible: boolean): Promise<boolean> => {
    if (!getTokenService() || !id) return false
    try {
        const response: any = await fetch(`${base}/accessibility`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ id, accessible })
        })
        const data: any = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}