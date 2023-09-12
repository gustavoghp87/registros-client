import { typeBlock, typeFace, typeTerritoryNumber } from '.'

export type typeCoords = {
    lat: number
    lng: number
}

export type typeMarker = {
    coords: typeCoords
    id: number
}

export type typeHTHHousehold = {
    doorName: string
    doorNumber: number
    id: number
    isChecked: boolean
    level: number|null
    offDates: number[]
    onDates: number[]
    // callingHTHState: typeCallingHTHState
}

export type typeHTHBuilding = {
    creatorId: number
    dateOfLastSharing: number
    hasCharacters: boolean
    hasContinuousNumbers: boolean
    hasLowLevel: boolean
    households: typeHTHHousehold[]
    manager?: typeHTHHousehold
    numberOfLevels: number
    numberPerLevel: number
    reverseOrderX: boolean
    reverseOrderY: boolean
    streetNumber: number
}

export type typeDoNotCall = {
    creatorId: number
    date: string
    doorBell: string
    id: number
    streetNumber: number
}

export type typeObservation = {
    creatorId: number
    date: string
    id: number
    text: string
}

export type typePolygon = {
    block: typeBlock
    buildings?: typeHTHBuilding[]
    color?: string
    completionData: {
        completionDates: number[]
        isFinished: boolean
        reopeningDates: number[]
    }
    coordsPoint1: typeCoords
    coordsPoint2: typeCoords
    coordsPoint3: typeCoords
    coordsPoint4?: typeCoords
    doNotCalls: typeDoNotCall[]
    face: typeFace
    id: number
    observations: typeObservation[]
    street: string
}

export type typeNewBlockPolygon = {
    block: typeBlock
    coordinates: typeCoords[]
    polygons: typePolygon[]
}

export type typeHTHMap = {
    centerCoords: typeCoords
    lastEditor: string
    markers: typeMarker[]
    newBlockPolygon?: typeNewBlockPolygon
    polygons: typePolygon[]
    zoom: number
}

export type typeHTHTerritory = {
    congregation: number;
    map: typeHTHMap
    territoryNumber: typeTerritoryNumber
}

// export type typeCallingHTHState = 'Atendido' | 'No atendido' | 'No tocado' | 'Carta dejada'
