export type typeUser = {
    _id: Object
    role: number
    estado: boolean
    email: string
    password?: string
    __v?: number
    group: number
    isAuth?: boolean
    isAdmin?: boolean
    asign?: number[]
    darkMode?: boolean
    campaign?: number[]
}

// new project

type typeUser1 = {
    _id: Object
    campaignAssignments: number[]
    email: string
    group: number
    isActive: boolean
    isAdmin: boolean
    isAuth: boolean
    phoneAssignments: number[]
    role: number
}
