import { getHeaders } from '.'
import { getTokenFromLSService } from './localStorageServices'
import { pointer } from '../app-config'
import { typeForecastResponse, typeResponseData, typeWeatherResponse } from '../models'

const base: string = pointer.weather

export const getWeatherAndForecastService = async (): Promise<{ weather?: typeWeatherResponse, forecast?: typeForecastResponse }|null> => {
    try {
        const weatherInLS = localStorage.getItem('weather')
        if (weatherInLS) {
            const weatherInLSObj = JSON.parse(weatherInLS)
            if (weatherInLSObj && weatherInLSObj.timestamp && weatherInLSObj.timestamp + 120000 > +new Date()) {
                return {
                    weather: weatherInLSObj.weather,
                    forecast: weatherInLSObj.forecast
                }
            }
        }
    } catch { }
    if (!getTokenFromLSService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || (!data.weather && !data.forecast)) return null
        localStorage.setItem('weather', JSON.stringify({ weather: data.weather, forecast: data.forecast, timestamp: +new Date() }))
        return {
            weather: data.weather,
            forecast: data.forecast
        }
    } catch (error) {
        console.log(error)
        return null
    }
}
