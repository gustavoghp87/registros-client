import { useEffect, useState } from 'react'
import { Loading } from '..'
import { Forecast } from './Forecast'
import { Weather } from './Weather'
import * as Icons from './WeatherIcons'
import { getWeatherAndForecastService } from '../../../services'
import { typeForecast, typeList, typeWeatherIcons } from '../../../models'

export const WeatherAndForecast = (props: any) => {

    const showForecast: boolean = props.showForecast || false
    const showWeather: boolean = props.showWeather || false
    const [currentDayForecast, setCurrentDayForecast] = useState<typeList>()
    const [forecasts, setForecasts] = useState<typeForecast[]>([])
    const [location, setLocation] = useState<string>("")

    useEffect(() => {
        const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        const getWeekday = (i: number) => {
            const today: number = new Date().getDay()
            if (i === today) return 'Hoy'
            if (i === today + 1 || i === today - 6) return 'Mañana'
            const date = new Date()
            date.setDate(date.getDate() + i)
            return weekdays[date.getDay()]
        }
        const weatherIcons: typeWeatherIcons = {
            'broken clouds': <Icons.CloudIcon />,
            'clear sky': <Icons.SunIcon />,
            'few clouds': <Icons.SunBehindCloudIcon />,
            'light rain': <Icons.SunBehindRainIcon />,
            'overcast-clouds': <Icons.CloudIcon />,
            'scattered clouds': <Icons.SunBehindLargeCloudIcon />,
            'shower rain': <Icons.RainIcon />,
            mist: <Icons.FogIcon />,
            rain: <Icons.SunBehindRainIcon />,
            snow: <Icons.SnowIcon />,
            thunderstorm: <Icons.CloudLightningIcon />
        }
        const getWeatherIcon = (key: string) => weatherIcons?.[key]
        getWeatherAndForecastService().then((response) => {
            console.log(response)
            if (!response) return
            if (response.weather) {

            }
            if (!response.forecast) return
            setLocation(`${response.forecast.city?.name}, ${response.forecast.city?.country}`)
            if (!response.forecast.list?.length) return
            setCurrentDayForecast(response.forecast.list[0])
            setForecasts(response.forecast.list?.map((forecast: typeList) => {
                const date: Date = new Date(forecast.dt * 1000)
                const day: number = date.getDay()
                return ({
                    date: {
                        dateDay: date.getDate(),
                        day: day,
                        hour: date.getHours(),
                        weekday: getWeekday(day)
                    },
                    icon: getWeatherIcon(forecast.weather?.[0]?.description),
                    temperatures: `${Math.ceil((forecast.main?.temp_max + forecast.main?.temp_min)/2)}ºC`,
                    list: forecast
                })
            }))
        })
    }, [])

    const weatherIcons: typeWeatherIcons = {
        'broken clouds': <Icons.CloudIcon />,
        'clear sky': <Icons.SunIcon />,
        'few clouds': <Icons.SunBehindCloudIcon />,
        'scattered clouds': <Icons.SunBehindLargeCloudIcon />,
        'shower rain': <Icons.RainIcon />,
        mist: <Icons.FogIcon />,
        rain: <Icons.SunBehindRainIcon />,
        snow: <Icons.SnowIcon />,
        thunderstorm: <Icons.CloudLightningIcon />
    }
    const getWeatherIcon = (key: string) => weatherIcons?.[key]

    return (
        <>
            {showWeather && currentDayForecast &&
                <Weather
                    chance={currentDayForecast?.pop || 0}
                    feelsLike={Math.round(currentDayForecast?.main?.feels_like || 0)}
                    icon={getWeatherIcon(currentDayForecast.weather?.[0]?.description)}
                    location={location}
                    rain={currentDayForecast?.rain?.['3h'] || 0}
                    temperature={Math.round(currentDayForecast?.main?.temp || 0)}
                />
            }

            {showForecast &&
                <>
                    {forecasts?.length ?
                        <Forecast forecasts={forecasts} />
                        :
                        <Loading mt={'30px'} />
                    }
                </>
            }
        </>
    )
}
