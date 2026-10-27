import { Api, type Errors } from '@/services/api'
import { z } from 'zod'

const citiesUrl = 'https://geocoding-api.open-meteo.com/v1/search'
const weatherUrl = 'https://api.open-meteo.com/v1/forecast'

const CitySchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional(),
  admin1: z.string().optional()
})

const CitiesSchema = z.object({
  results: z.array(CitySchema).default([])
})

const WeatherSchema = z.object({
  timezone: z.string(),
  utc_offset_seconds: z.number(),
  current: z.object({
    time: z.string(),
    temperature_2m: z.number(),
    apparent_temperature: z.number(),
    relative_humidity_2m: z.number(),
    weather_code: z.number(),
    is_day: z.number(),
    wind_speed_10m: z.number(),
    surface_pressure: z.number()
  }),
  daily: z.object({
    time: z.array(z.string()),
    weather_code: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number())
  })
})

export type City = z.infer<typeof CitySchema>
export type Weather = z.infer<typeof WeatherSchema>

const CITIES_ERRORS: Errors = {
  default: 'Не удалось загрузить города. Попробуйте позже',
  network: 'Не удалось подключиться к сервису поиска городов. Проверьте интернет',
  response: 'Сервис вернул некорректный список городов',
  429: 'Слишком много запросов. Попробуйте позже',
  504: 'Сервис поиска городов не ответил вовремя. Попробуйте позже'
}

const WEATHER_ERRORS: Errors = {
  default: 'Не удалось загрузить погоду. Попробуйте позже',
  network: 'Не удалось подключиться к сервису погоды. Проверьте интернет',
  response: 'Сервис вернул некорректные данные о погоде',
  429: 'Слишком много запросов. Попробуйте позже',
  504: 'Сервис погоды не ответил вовремя. Попробуйте позже'
}

export async function getCities(name: string): Promise<City[]> {
  const searchParams = new URLSearchParams({
    name: name.trim(),
    count: '10',
    language: 'ru'
  })

  try {
    const response = await Api.fetchGet(`${citiesUrl}?${searchParams.toString()}`, CITIES_ERRORS, true)
    const data = await Api.parseResponse(response, CitiesSchema)
    return data.results
  }
  catch (error) {
    Api.throwResponseError(error, CITIES_ERRORS, true)
  }
}

export async function getWeather(latitude: number, longitude: number): Promise<Weather> {
  const searchParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day,wind_speed_10m,surface_pressure',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    forecast_days: '5',
    wind_speed_unit: 'ms',
    timezone: 'auto'
  })

  try {
    const response = await Api.fetchGet(`${weatherUrl}?${searchParams.toString()}`, WEATHER_ERRORS, true)
    return await Api.parseResponse(response, WeatherSchema)
  }
  catch (error) {
    Api.throwResponseError(error, WEATHER_ERRORS, true)
  }
}
