import { createContext, useContext, useEffect, useState } from 'react'
import { authUserService, getTokenService, getUserFromLSService, loginService, logoutService, removeUserFromLSService, setUserFromLSService } from '../services'
import { typeResponseData, typeUser } from '../models'

type contextType = {
    login: ((email: string, password: string, recaptchaToken: string) => Promise<typeResponseData | null>) | undefined,
    logout: (() => void) | undefined,
    refreshUser: (() => void) | undefined,
    user: typeUser | undefined
}

const defaultValue: contextType = {
    login: undefined,
    logout: undefined,
    refreshUser: undefined,
    user: undefined
}

const AuthContext: React.Context<contextType> = createContext(defaultValue)
export const useAuth = (): contextType => useContext<contextType>(AuthContext)

export const AuthProvider = ({ children }: any) => {

    const [user, setUser] = useState<typeUser>()

    const login = async (email: string, password: string, recaptchaToken: string): Promise<typeResponseData|null> => {
        const serviceResponse: typeResponseData|null = await loginService(email, password, recaptchaToken)
        return serviceResponse
    }

    const logout = (): void => {
        logoutService()
        setUser(undefined)
    }

    const refreshUser = (): void => {
        removeUserFromLSService()
        setUser(undefined)
    }

    useEffect(() => {
        if (user) return

        const userInLocalStorage: string|null = getUserFromLSService()
        if (userInLocalStorage) {
            try {
                const user0: typeUser = JSON.parse(userInLocalStorage)
                setUser(user0)
                return
            } catch (error) {
                console.log(error)
                removeUserFromLSService()
            }
        }

        if (getTokenService()) {
            authUserService().then((user0: typeUser|null) => {
                if (!user0) return
                setUser(user0)
                setUserFromLSService(JSON.stringify(user0))
            })
        }

        return () => setUser(undefined)
    }, [user, user?.isAuth])


    return (
        <AuthContext.Provider
            value={{
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
