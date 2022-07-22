import { typeFace } from './houseToHouse'

export type typeHousehold = {
    _id?: Object
    inner_id: string
    territorio: string
    manzana: typeBlock
    direccion: string
    telefono: string
    estado: typeCallingState
    noAbonado: boolean
    fechaUlt?: string
    variante: typeVariant
    asignado?: boolean
}

export type typeBlock = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export type typeTerritoryNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31' | '32' | '33' | '34' | '35' | '36' | '37' | '38' | '39' | '40' | '41' | '42' | '43' | '44' | '45' | '46' | '47' | '48' | '49' | '50' | '51' | '52' | '53' | '54' | '55' | '56'

export type typeCallingState = "No predicado" | "Contestó" | "No contestó" | "A dejar carta" | "No llamar"

export type typeVariant = 'success' | 'dark' | 'primary' | 'danger' | 'warning' | 'light' | 'secondary' | 'info' | 'link'

export type typeStateOfTerritory = {
    _id?: object
    territorio: string
    isFinished: boolean
    resetDate?: typeResetDate[]
}

export type typeResetDate = {
    date: number
    option: number
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NEW PROJECT :

type typeTelephonicTerritory = {
    _id?: Object
    blocks: typeBlocks[]
    territoryNumber: number
}

type typeBlocks = {
    block: typeBlock
    faces: typeStreet[]
}

type typeStreet = {
    face: typeFace
    households: typeHousehold1[]
    street: string
}

type typeHousehold1 = {
    assigned?: boolean
    callingState: typeCallingState
    dateOfLastCall: string
    doorBell: string
    inner_id: number
    notSubscribed: boolean
    phoneNumber: string
    streetNumber: number
    variant: typeVariant
}
