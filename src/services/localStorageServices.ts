export const getTokenFromLSService = (): string|null => localStorage.getItem('token')
export const setTokenFromLSService = (newToken: string) => localStorage.setItem('token', newToken)
export const clearTokenFromLSService = (): void => localStorage.removeItem('token')
export const clearUserFromLSService = (): void => localStorage.removeItem('user')
export const getDarkModeLocalStorageFromLSService = (): boolean => localStorage.getItem('darkMode') === 'true'
export const setDarkModeLocalStorageFromLSService = (darkMode: boolean): void => localStorage.setItem('darkMode', darkMode?.toString())
