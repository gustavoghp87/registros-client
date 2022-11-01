import { ReactNode, useEffect, useState } from 'react'
import { Hr, Loading } from '..'
import { Forecast } from './Forecast'
import { Weather } from './Weather'
import * as Icons from './WeatherIcons'
import { getWeatherAndForecastService } from '../../../services'
import { typeForecast, typeForecastResponse, typeList, typeWeatherIcons, typeWeatherResponse } from '../../../models'

const weatherIcons: typeWeatherIcons = {
    'broken clouds': <Icons.CloudIcon />,
    'clear sky': <Icons.SunIcon />,
    'few clouds': <Icons.SunBehindCloudIcon />,
    'light rain': <Icons.SunBehindRainIcon />,
    'mist': <Icons.FogIcon />,
    'overcast clouds': <Icons.CloudIcon />,
    'overcast-clouds': <Icons.CloudIcon />,
    'rain': <Icons.SunBehindRainIcon />,
    'scattered clouds': <Icons.SunBehindLargeCloudIcon />,
    'shower rain': <Icons.RainIcon />,
    'snow': <Icons.SnowIcon />,
    'thunderstorm': <Icons.CloudLightningIcon />,
    'thunderstorm with light rain': <Icons.CloudLightningIcon />
}

const getWeatherIcon = (key: string): ReactNode => weatherIcons?.[key] || key

export const WeatherAndForecast = (props: any) => {

    const showForecast0: boolean = props.showForecast || false
    const showWeather: boolean = props.showWeather || false
    const [weatherRightNow, setWeatherRightNow] = useState<typeList>()
    const [forecasts, setForecasts] = useState<typeForecast[]>([])
    const [showForecast, setShowForecast] = useState<boolean>(showForecast0)

    const getWeekday = (i: number) => {
        const weekdays: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        const today: number = new Date().getDay()
        if (i === today) return 'Hoy'
        if (i === today + 1 || i === today - 6) return 'Mañana'
        return weekdays[i]
    }

    useEffect(() => {
        getWeatherAndForecastService().then((response: { weather?: typeWeatherResponse, forecast?: typeForecastResponse }|null) => {
            if (!response) return
            if (response.weather) {
                setWeatherRightNow({
                    clouds: response.weather.clouds,
                    dt: response.weather.dt,
                    dt_txt: response.weather.dt?.toString(),
                    main: response.weather.main,
                    name: response.weather.name,
                    pop: 0,
                    rain: response.weather.rain,
                    sys: response.weather.sys,
                    visibility: response.weather.visibility,
                    weather: response.weather.weather,
                    wind: response.weather.wind
                })
            }
            if (response.forecast) {
                if (!response.forecast.list?.length) return
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
                        list: forecast,
                        pop: forecast.pop,
                        temperatures: Math.ceil((forecast.main?.temp_max + forecast.main?.temp_min)/2),
                    })
                }))
            }
        })
    }, [])

    return (
        <>
            {showWeather && weatherRightNow &&
                <>
                    <Weather
                        chance={Math.round((forecasts[0]?.list.pop || 0) * 100)}
                        feelsLike={Math.round(weatherRightNow?.main?.feels_like || 0)}
                        icon={getWeatherIcon(weatherRightNow.weather?.[0]?.description)}
                        location={`${weatherRightNow.name}, ${weatherRightNow.sys?.country}`}
                        rain={(weatherRightNow?.rain?.['1h'] || 0) * 100}
                        temperature={Math.round(weatherRightNow?.main?.temp || 0)}
                    />
                    <button className={'btn btn-general-blue d-block mx-auto mt-2 mb-4'}
                        onClick={() => setShowForecast(x => !x)}
                        style={{ width: '250px' }}
                    >
                        {showForecast ? "Ocultar Pronóstico" : "Ver Pronóstico"}
                    </button>
                    <Hr />
                </>
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

            {showWeather && showForecast && <Hr />}
        </>
    )
}
