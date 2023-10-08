import { typeAllLogsObj } from "./log"
import { typeHTHTerritory } from "./houseToHouse"
import { typeTelephonicTerritory } from "./telephonic"
import { typeUser } from "./user"

export type typeConfig = {
    congregation: number
    date: number
    dbBackupLastDate: string
    googleBoardUrl: string
    isDisabledCloseHthFaces: boolean
    isDisabledEditHthMaps: boolean
    isDisabledHthBuildingsForUnassignedUsers: boolean
    isDisabledHthFaceObservations: boolean
    name: string
    numberOfTerritories: number
    usingLettersForBlocks: boolean
}

export type typeDbBackup = {
    config: typeConfig
    houseToHouseTerritories: typeHTHTerritory[]
    logs: typeAllLogsObj
    telephonicTerritories: typeTelephonicTerritory[]
    users: typeUser[]
}
