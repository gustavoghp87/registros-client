
export interface ParamTypes {
    territorio: string
}

export interface ITerritorio {
    unterritorio: IVivienda[]
}

export interface IVivienda {
    _id: Object
    inner_id: string
    territorio: string
    manzana: string
    cuadra: string
    direccion: string
    telefono: string
    estado: string
    noAbonado: boolean
    fechaUlt?: string
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
