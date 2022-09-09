import { ReactNode } from 'react'

export type typeForecastResponse = {
    cod: string
    message: number
    cnt: number
    list: typeList[]
    city: City
}

export type typeForecast = {
    icon: ReactNode
    list: typeList
    temperatures: string
    date: {
        dateDay: number,
        day: number,
        hour: number,
        weekday: string
    }
}

export type typeWeatherResponse = {
    base: 'stations'
    clouds: Clouds
    cod: number
    coord: Coord
    dt: number
    id: number
    main: Main
    name: string
    rain: {
        '1h': number
    }
    sys: {
        country: string
        id: number
        pod: string
        sunrise: number
        sunset: number
        type: number
    }
    timezone: number
    visibility: number
    weather: [typeWeather]
    wind: {
        deg: number
        gust: number
        speed: number
    }
}

export type typeWeather = {
    id: number
    main: string
    description: string
    icon: string
}

export type typeWeatherIcons = {
    [key: string]: JSX.Element
}

export type City = {
    id: number
    name: string
    coord: Coord
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
}

export type Main = {
    feels_like: number
    grnd_level?: number
    humidity: number
    pressure: number
    sea_level?: number
    temp_kf?: number
    temp_max: number
    temp_min: number
    temp: number
}

export type Clouds = {
    all: number
}
  
export type Wind = {
    deg: number
    gust: number
    speed: number
}
  
export type Rain = {
    '1h'?: number
    '3h'?: number
}
  
export type Sys = {
    country: string
    pod: string
}
  
export type typeList = {
    clouds: Clouds
    dt_txt: string
    dt: number
    main: Main
    name: string
    pop: number
    rain: Rain
    sys: Sys
    visibility: number
    weather: typeWeather[]
    wind: Wind
}
  
export type Coord = {
    lat: number
    lon: number
}
