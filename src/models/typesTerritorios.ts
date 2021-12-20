
export type typeVivienda = {
    _id?: Object
    inner_id: string
    territorio: string
    manzana: typeBlock
    direccion: string
    telefono: string
    estado: estado
    noAbonado: boolean
    fechaUlt?: string
    variante: variant
    asignado?: boolean
}

export type typeTerritorio = {
    households: typeVivienda[]
}

export type typeBlock = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' 

export const noPredicado: string = "No predicado"
export const contesto: string = "Contestó"
export const noContesto: string = "No contestó"
export const aDejarCarta: string = "A dejar carta"
export const noLlamar: string = "No llamar"

type estado = "No predicado" | "Contestó" | "No contestó" | "A dejar carta" | "No llamar"

export type variant = "success" | "dark" | "primary" | "danger" | "warning" | "light" | "secondary" | "info" | "link"

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
