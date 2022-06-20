import { typeBlock, typeTerritoryNumber } from './territory'

export type typeFace = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export type typeHTHTerritory = {
    _id?: Object
    doNotCalls: typeDoNotCall[]
    finished: typeFinishedFace[]
    observations: typeObservation[]
    territory: typeTerritoryNumber
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

export type typeFinishedFace = {
    block: typeBlock
    face: typeFace
}
