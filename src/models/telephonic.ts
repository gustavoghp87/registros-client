import { typeBlock } from '.'

export type typeHousehold = {
    _id?: Object
    asignado?: boolean
    direccion: string
    doNotMove?: boolean
    estado: typeCallingState
    fechaUlt?: string
    inner_id: string
    manzana: typeBlock
    noAbonado: boolean
    telefono: string
    territorio: string
    variante: typeVariant
}

export type typeCallingState = "No predicado" | "Contestó" | "No contestó" | "A dejar carta" | "No llamar"

export type typeVariant = 'success' | 'dark' | 'primary' | 'danger' | 'warning' | 'light' | 'secondary' | 'info' | 'link'

export type typeStateOfTerritory = {
    _id?: object
    isFinished: boolean
    resetDate?: typeResetDate[]
    territorio: string
}

export type typeResetDate = {
    date: number
    option: typeOption
}

type typeOption = 1 | 2 | 3 | 4

export type typeStatistic = {
    count: number
    countContesto: number
    countNoContesto: number
    countDejarCarta: number
    countNoLlamar: number
    countNoAbonado: number
    libres: number
}

export interface typeLocalStatistic extends typeStatistic {
    territorio: string
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NEW PROJECT :

type typeTelephonicTerritory = {
    _id?: Object
    households: typeHousehold1
    stateOfTerritory: typeStateOfTerritory1
    territoryNumber: number
}

type typeHousehold1 = {
    address: string //
    assigned?: boolean
    block: typeBlock
    callingState: typeCallingState
    dateOfLastCall: string
    //doorBell: string
    inner_id: number
    notSubscribed: boolean
    phoneNumber: string
    //streetNumber: number
    variant: typeVariant
}

type typeStateOfTerritory1 = {
    isFinished: boolean
    resetDates: typeResetDate[]
}
