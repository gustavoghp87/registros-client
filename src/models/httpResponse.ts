import { typeCampaignPack } from './campaign'
import { typeHTHTerritory } from './houseToHouse'
import { typeLogsObj } from './log'
import { typeLocalStatistic, typeStatistic } from './statistic'
import { typeHousehold, typeStateOfTerritory, typeBlock } from './territory'
import { typeUser } from './user'

export type typeResponseData = {
    success: boolean
    pack: typeCampaignPack
    packs: typeCampaignPack[]
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
}
