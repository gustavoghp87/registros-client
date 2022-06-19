import { typeBlock, typeTerritoryNumber } from "./territory"

export type typeFace = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export type typeHTHTerritory = {
    _id?: Object
    isFinished: boolean
    territory: typeTerritoryNumber
    doNotCalls: typeDoNotCall[]
    observations: typeObservation[]
}

export type typeDoNotCall = {
    block: typeBlock
    creator: string
    date: string
    doorBell: string
    face: typeFace
    id: number
    street: string
    streetNumber: number
}

export type typeObservation = {
    block: typeBlock
    creator: string
    date: string
    face: typeFace
    id: number
    street: string
    text: string
}
