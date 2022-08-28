import { pointer } from '../config'
import { getHeaders } from '.'
import { getTokenService } from './userServices'
import { typeForecastResponse, typeResponseData, typeWeatherResponse } from '../models'

const base: string = pointer.weather

export const getWeatherAndForecastService = async (): Promise<{ weather?: typeWeatherResponse, forecast?: typeForecastResponse }|null> => {
    if (!getTokenService()) return null
    try {
        const response = await fetch(base, {
            method: 'GET',
            headers: getHeaders()
        })
        const data: typeResponseData = await response.json()
        if (!data || !data.success || (!data.weather && !data.forecast)) return null
        return {
            weather: data.weather,
            forecast: data.forecast
        }
    } catch (error) {
        console.log(error)
        return null
    }
}
