
export type typeParam = {
    territorio: string
}

export type typeTerritorio = {
    unterritorio: typeVivienda[]
}

export type typeVivienda = {
    _id?: Object
    inner_id: string
    territorio: string
    manzana: string
    direccion: string
    telefono: string
    estado:  "No predicado" | "Contestó" | "No contestó" | "A dejar carta" | "No llamar"
    noAbonado: boolean
    fechaUlt?: string
    variante: "success" | "dark" | "primary" | "danger" | "warning" | "light"
}


/////////////////////////////////////////////////////////////////////////////////////

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
