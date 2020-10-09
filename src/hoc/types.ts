
export interface ParamTypes {
    territorio: string
}

export interface ITerritorio {
    unterritorio: IVivienda[]
}

export interface IVivienda {
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

export interface IUser {
    _id: Object
    role: number
    estado: string
    actividad?: IActividad[]
    email: string
    password: string
    __v?: number
    group: number
    isAuth?: boolean
    asign?: number[]
}

export interface IState {
    user: {
        userData: {
            _id: Object
            role: number
            estado: string
            actividad: Object[]
            email: string
            password: string
            __v?: number
            group: number
            isAuth?: boolean
            asign?: number[]
        }
    }
}

export type ActividadType = IActividad[]

interface IActividad {
    inner_id?: string
    territorio?: string
    manzana?: string
    cuadra?: string
    direccion?: string
    telefono?: string
    estado?: string
    noAbonado?: boolean
    fechaUlt?: string
}

export interface IUsers {
    usuarios: IUser[]
}
