
export type typeHousehold = {
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

export type typeBlock = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export type typeTerritoryNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31' | '32' | '33' | '34' | '35' | '36' | '37' | '38' | '39' | '40' | '41' | '42' | '43' | '44' | '45' | '46' | '47' | '48' | '49' | '50' | '51' | '52' | '53' | '54' | '55' | '56'

type estado = "No predicado" | "Contestó" | "No contestó" | "A dejar carta" | "No llamar"

export type variant = 'success' | 'dark' | 'primary' | 'danger' | 'warning' | 'light' | 'secondary' | 'info' | 'link'

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
