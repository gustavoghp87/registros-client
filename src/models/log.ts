export type typeLog = {
    logText: string
    timestamp: number
}

export type typeLogsObj = {
    appLogs: typeLog[]
    campaignAssignmentLogs: typeLog[]
    campaignFinishingLogs: typeLog[]
    emailErrorLogs: typeLog[]
    errorLogs: typeLog[]
    loginLogs: typeLog[]
    stateOfTerritoryChangeLogs: typeLog[]
    territoryChangeLogs: typeLog[]
    userChangesLogs: typeLog[]
}
