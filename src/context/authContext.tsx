import { createContext, useContext, useEffect, useState } from 'react'
import { loginService, logoutService } from '../services/tokenServices'
import { typeUser } from '../models/user'
import { getTokenService } from '../services/tokenServices'
import { authUserService } from '../services/userServices'


type defaultValueType = {
    loading: boolean,
    login: ((email: string, password: string, recaptchaToken: string) => Promise<any>) | undefined,
    logout: (() => void) | undefined,
    refreshUser: (() => void) | undefined,
    user: typeUser | undefined
}

const userKey: string = "user"

const defaultValue: defaultValueType = {
    loading: true,
    login: undefined,
    logout: undefined,
    refreshUser: undefined,
    user: undefined
}

const AuthContext = createContext(defaultValue)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: any) => {

    const [user, setUser] = useState<typeUser>()
    const [loading, setLoading] = useState(true)

    const login = async (email: string, password: string, recaptchaToken: string): Promise<any> => {
        const serviceResponse = await loginService(email, password, recaptchaToken)
        return serviceResponse
    }

    const logout = (): void => {
        logoutService()
        setUser(undefined)
    }

    const refreshUser = (): void => {
        localStorage.removeItem(userKey)
        setUser(undefined)
    }

    
    useEffect(() => {
        if (user) return

        const userInLocalStorage: string|null = localStorage.getItem(userKey)
        if (userInLocalStorage) {
            try {
                const user0: typeUser = JSON.parse(userInLocalStorage);
                setUser(user0);
                return
            } catch (error) {
                console.log(error);
                localStorage.removeItem(userKey)
            }
        }

        if (getTokenService()) {
            authUserService().then((user0: typeUser|null) => {
                if (user0) {
                    setUser(user0)
                    setLoading(false)
                    localStorage.setItem(userKey, JSON.stringify(user0))
                }
            })
        }

        const unsubscribe = () => {
            setUser(undefined)
            setLoading(true)
        }

        return () => unsubscribe()
    }, [user, user?.isAuth])


    return (
        <AuthContext.Provider
            value={{
                loading,
                login,
                logout,
                refreshUser,
                user
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
