export const getTokenFromLSService = (): string|null => localStorage.getItem('token')
export const removeTokenFromLSService = (): void => localStorage.removeItem('token')
export const setTokenToLSService = (token: string) => localStorage.setItem('token', token)

export const getUserFromLSService = (): string|null => localStorage.getItem('user')
export const removeUserFromLSService = () => localStorage.removeItem('user')
export const setUserToLSService = (user: string) => localStorage.setItem('user', user)

export const getFailingEmailFromLSService = (): string|null => localStorage.getItem('failingEmail')
export const removeFailingEmailFromLSService = (): void => localStorage.removeItem('failingEmail')
export const setFailingEmailToLSService = (failingEmail: string) => localStorage.setItem('failingEmail', failingEmail)

export const getDarkModeFromLSService = (): boolean => localStorage.getItem('darkMode') === 'true'
export const setDarkModeToLSService = (darkMode: boolean): void => localStorage.setItem('darkMode', darkMode?.toString())
