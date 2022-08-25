import { Credentials } from 'google-auth-library'
import * as type from '.'

export type typeResponseData = {                           //  =>  UPDATE MOCKED USERS  <=
    success: boolean
    //
    address?: string
    allLogsObj?: type.typeAllLogsObj
    alreadyExists?: boolean
    campaignAssignments?: number[]
    campaignPack?: type.typeCampaignPack
    campaignPacks?: type.typeCampaignPack[]
    congregationItems?: type.typeCongregationItem[]
    coordinates?: type.typeCoords
    dataError?: boolean
    email?: string
    emailSuccess?: boolean
    expired?: boolean
    globalStatistics?: type.typeTelephonicStatistic,
    gmailKeys?: Credentials
    household?: type.typeHousehold
    hthTerritory?: type.typeHTHTerritory
    isDisabled?: boolean
    localStatistics?: type.typeLocalTelephonicStatistic[]
    modifiedCount?: number
    newPassword?: string
    newToken?: string,
    recaptchaFails?: boolean
    streets?: string[]
    telephonicTerritory?: type.typeTelephonicTerritory
    url?: string
    used?: boolean
    user?: type.typeUser
    userExists?: boolean
    users?: type.typeUser[]
    wrongPassword?: boolean
}
