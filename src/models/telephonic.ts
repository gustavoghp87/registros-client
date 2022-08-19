import { typeBlock, typeTerritoryNumber } from '.'

export type typeCallingState = "No predicado" | "No contestó" | "Contestó" | "No llamar" | "A dejar carta"

type typeVariant = 'success' | 'dark' | 'primary' | 'danger' | 'warning' | 'light' | 'secondary' | 'info' | 'link'

export type typeTelephonicTerritory = {
    _id?: Object
    households: typeHousehold[]
    stateOfTerritory: typeStateOfTelephonicTerritory
    territoryNumber: typeTerritoryNumber
}

export type typeHousehold = {
    address: string
    block: typeBlock
    callingState: typeCallingState
    dateOfLastCall: number
    doNotMove: boolean
    householdId: number
    isAssigned: boolean
    notSubscribed: boolean
    phoneNumber: string
    variant: typeVariant
}

type typeStateOfTelephonicTerritory = {
    isFinished: boolean
    resetDates: typeResetDate[]
}

export type typeResetDate = {
    date: number
    option: typeOption
}

type typeOption = 1 | 2 | 3 | 4

export type typeTelephonicStatistic = {
    numberOf_ADejarCarta: number
    numberOf_ADejarCarta_relative: number
    numberOf_Contesto: number
    numberOf_FreePhones: number
    numberOf_FreePhones_relative?: number
    numberOf_NoAbonado: number
    numberOf_NoContesto: number
    numberOf_NoContesto_relative?: number
    numberOf_NoLlamar: number
    numberOf_NoLlamar_relative: number
    numberOfAlreadyCalled: number
    numberOfAlreadyCalledRelative: number
    numberOfAlreadyDone: number
    numberOfAlreadyDoneRelative: number
    numberOfHouseholds: number
}

export interface typeLocalTelephonicStatistic extends typeTelephonicStatistic {
    isFinished: boolean
    territoryNumber: typeTerritoryNumber
}