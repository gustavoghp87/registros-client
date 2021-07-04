
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
