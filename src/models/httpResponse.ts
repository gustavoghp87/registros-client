import { Credentials } from 'google-auth-library'
import * as type from '.'

export type typeResponseData = {
    success: boolean
    //
    address?: string
    allLogsObj?: type.typeAllLogsObj
    campaignAssignments?: number[]
    congregationItems?: type.typeCongregationItem[]
    coordinates?: type.typeCoords
    email?: string
    emailSuccess?: boolean
    expired?: boolean
    gmailKeys?: Credentials
    household?: type.typeHousehold
    households?: type.typeHousehold[]
    hthTerritory?: type.typeHTHTerritory
    isDisabled?: boolean
    localStatistics?: type.typeLocalTelephonicStatistic[]
    modifiedCount?: number
    newPassword?: string
    newToken?: string,
    numberOfFreePhones?: number
    campaignPack?: type.typeCampaignPack
    campaignPacks?: type.typeCampaignPack[]
    recaptchaFails?: boolean
    globalStatistics?: type.typeTelephonicStatistic,
    telephonicTerritory?: type.typeTelephonicTerritory
    url?: string
    used?: boolean
    user?: type.typeUser
    userExists?: boolean
    users?: type.typeUser[]
    streets?: string[]
    wrongPassword?: boolean
}
