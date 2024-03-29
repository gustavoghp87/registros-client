import { Credentials } from 'google-auth-library'
import * as type from '.'

export type typeResponseData = {                           //  =>  UPDATE MOCKED USERS  <=
    success: boolean
    //
    address?: string
    allLogsObj?: type.typeAllLogsObj
    alreadyExists?: boolean
    boardItems?: type.typeBoardItem[]
    campaignAssignments?: number[]
    campaignPack?: type.typeCampaignPack
    campaignPacks?: type.typeCampaignPack[]
    config?: type.typeConfig
    coordinates?: type.typeCoords
    dataError?: boolean
    dbBackup?: type.typeDbBackup
    email?: string
    emailSuccess?: boolean
    expired?: boolean
    forecast?: type.typeForecastResponse
    globalStatistics?: type.typeTelephonicStatistic,
    gmailKeys?: Credentials
    household?: type.typeHousehold
    hthTerritory?: type.typeHTHTerritory
    hthTerritories?: type.typeHTHTerritory[]
    isDisabled?: boolean
    localStatistics?: type.typeLocalTelephonicStatistic[]
    modifiedCount?: number
    newPassword?: string
    newToken?: string,
    notSent?: boolean
    notSharedToday?: boolean
    recaptchaFails?: boolean
    street?: string
    streets?: string[]
    telephonicTerritory?: type.typeTelephonicTerritory
    territoriesTableData?: type.typeTerritoryRow[]
    url?: string
    used?: boolean
    user?: type.typeUser
    userExists?: boolean
    users?: type.typeUser[]
    weather?: type.typeWeatherResponse
    wrongPassword?: boolean
}
