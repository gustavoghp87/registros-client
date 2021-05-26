
export type manzana = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' 

export type typeParam = {
    territorio: string
    manzana: manzana
    todo: 'todo' | ''
    id: string
}

export type typeTerritorio = {
    unterritorio: typeVivienda[]
}

export type estado = "No predicado" | "Contestó" | "No contestó" | "A dejar carta" | "No llamar"

export type variante = "success" | "dark" | "primary" | "danger" | "warning" | "light"

export type typeVivienda = {
    _id?: Object
    inner_id: string
    territorio: string
    manzana: string
    direccion: string
    telefono: string
    estado: estado
    noAbonado: boolean
    fechaUlt?: string
    variante: variante
    asignado?: boolean
}


//////////////////////////////////////////////////////////////////////////////////////////////

export type typeUser = {
    _id: Object
    role: number
    estado: boolean
    email: string
    password?: string
    __v?: number
    group: number
    isAuth?: boolean
    asign?: number[]
    darkMode?: boolean
}

export type typeState = {
    user: {
        userData: {
            _id: Object
            role: number
            estado: boolean
            email: string
            password: string
            __v?: number
            group: number
            isAuth?: boolean
            asign?: number[]
        }
    }
}

export type typeUsers = {
    usuarios: typeUser[]
}


//////////////////////////////////////////////////////////////////////////////////////////////

export type typePack = {
    paquete: number
    id: number
    desde: number
    al: number
    asignado?: string
    terminado?: boolean
    llamados?: number[]
}

export type typeCampaign = {
    packs: typePack[]
}
