import { getHeaders } from '.'
import { getTokenService } from './userServices'
import { pointer } from '../config'
import { typeCampaignPack, typeResponseData } from '../models'

const base: string = pointer.campaign

export const askForANewCampaignPackService = async (): Promise<boolean> => {
    if (!getTokenService()) return false
    try {
        const response = await fetch(`${base}/new-pack`, {
            method: 'POST',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
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
        const response = await fetch(`${base}/${id.toString()}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ email })
        })
        const data: typeResponseData = await response.json()
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
        const response = await fetch(`${base}/all`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ id })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const editCampaignPackService = async (phoneNumber: number, checked: boolean, id: number): Promise<typeCampaignPack|null> => {
    // if (!getTokenService() || !phoneNumber || checked === undefined) return false    accessible
    if (!phoneNumber || checked === undefined) return null
    try {
        const response = await fetch(base, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ phoneNumber, checked, id })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.campaignPack) return null
        return data.campaignPack
    } catch (error) {
        console.log(error)
        return null
    }
}

export const enableAccesibilityModeService = async (id: number, accessible: boolean): Promise<boolean> => {
    if (!getTokenService() || !id) return false
    try {
        const response = await fetch(`${base}/accessibility`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ id, accessible })
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const getCampaignAssignmentsByUser = async (): Promise<number[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/assignment`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.campaignAssignments) return null
        return data.campaignAssignments
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getCampaignPacksService = async (): Promise<typeCampaignPack[]|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(`${base}/all`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.campaignPacks) return null
        return data.campaignPacks
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getCampaignPackService = async (id: number): Promise<typeCampaignPack|null> => {
    // if (!getTokenService() || !id) return null    accessible
    if (!id) return null
    try {
        const response = await fetch(`${base}/${id.toString()}`, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || !data.campaignPack) return null
        return data.campaignPack
    } catch (error) {
        console.log(error)
        return null
    }
}
