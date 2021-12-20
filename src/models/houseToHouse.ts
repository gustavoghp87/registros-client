import { typeBlock, variant } from "./typesTerritorios"

export type typeHTHState = "No predicado" | "No contestó" | "Contestó" | "No tocar" | "Carta dejada"

export const noPredicado: typeHTHState = "No predicado"
export const noContesto: typeHTHState = "No contestó"
export const contesto: typeHTHState = "Contestó"
export const noTocar: typeHTHState = "No tocar"
export const cartaDejada: typeHTHState = "Carta dejada"

export type typeHTHBuilding = {
    _id?: Object
    territory: string
    manzana?: typeBlock           // ?
    street: string
    streetNumber: number
    households: typeHTHHousehold[]
}

export type typeHTHHousehold = {
    isChecked: boolean
    piso: string
    depto: string
    idNumber: number
    estado: typeHTHState
    lastTime: string
    variant: variant
}
