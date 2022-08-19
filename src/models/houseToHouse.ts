import { typeBlock, typeFace, typeTerritoryNumber } from '.'

export type typeHTHTerritory = {
    _id?: Object
    map: typeHTHMap
    territoryNumber: typeTerritoryNumber
}

export type typeHTHMap = {
    centerCoords: typeCoords
    lastEditor: string
    markers: typeMarker[]
    polygons: typePolygon[]
    zoom: number
}

export type typeCoords = {
    lat: number
    lng: number
}

export type typeMarker = {
    coords: typeCoords
    id: number
}

export type typePolygon = {
    block: typeBlock
    coordsPoint1: typeCoords
    coordsPoint2: typeCoords
    coordsPoint3: typeCoords
    doNotCalls: typeDoNotCall[]
    face: typeFace
    id: number
    isFinished: boolean
    observations: typeObservation[]
    street: string
}

export type typeDoNotCall = {
    creator: string
    date: string
    doorBell: string
    id: number
    streetNumber: number
}

export type typeObservation = {
    creator: string
    date: string
    id: number
    text: string
}
