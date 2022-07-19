import { Credentials } from 'google-auth-library'
import { typeBlock, typeCampaignPack, typeCoords, typeHousehold, typeHTHTerritory, typeLocalStatistic, typeLogsObj, typeStateOfTerritory, typeStatistic, typeUser } from './'

export type typeResponseData = {
    success: boolean
    pack?: typeCampaignPack
    packs?: typeCampaignPack[]
    logsObject?: typeLogsObj
    stateOfTerritory?: typeStateOfTerritory
    stateOfTerritories?: typeStateOfTerritory[]
    household?: typeHousehold
    households?: typeHousehold[]
    isAll?: boolean
    blocks?: typeBlock[]
    newPassword?: string
    emailFailed?: string
    newToken?: string,
    recaptchaFails?: boolean
    user?: typeUser
    users?: typeUser[]
    email?: string
    wrongPassword?: boolean
    userExists?: boolean
    isDisabled?: boolean
    expired?: boolean
    used?: boolean
    statistic?: typeStatistic,
    localStatistic?: typeLocalStatistic
    localStatistics?: typeLocalStatistic[]
    numberOfFreePhones?: number
    hthTerritory?: typeHTHTerritory
    streets?: string[]
    url?: string
    gmailKeys?: Credentials
    coordinates?: typeCoords
    address?: string
}
