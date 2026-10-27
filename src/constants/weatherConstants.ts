import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Moon, Sun } from '@/assets/icons'
import type { City } from '@/services/weather.api'
import type { ImageProps } from 'expo-image'

export const weatherCodes: Record<number, { description: string, icon: ImageProps['source'], nightIcon?: ImageProps['source'] }> = {
  [-1]: { description: 'Нет описания', icon: Cloud },
  0: { description: 'Ясно', icon: Sun, nightIcon: Moon },
  1: { description: 'Преимущественно ясно', icon: CloudSun, nightIcon: CloudMoon },
  2: { description: 'Переменная облачность', icon: CloudSun, nightIcon: CloudMoon },
  3: { description: 'Пасмурно', icon: Cloud },
  45: { description: 'Туман', icon: CloudFog },
  48: { description: 'Туман с изморозью', icon: CloudFog },
  51: { description: 'Слабая морось', icon: CloudDrizzle },
  53: { description: 'Морось', icon: CloudDrizzle },
  55: { description: 'Сильная морось', icon: CloudDrizzle },
  56: { description: 'Слабая переохлаждённая морось', icon: CloudDrizzle },
  57: { description: 'Сильная переохлаждённая морось', icon: CloudDrizzle },
  61: { description: 'Небольшой дождь', icon: CloudRain },
  63: { description: 'Дождь', icon: CloudRain },
  65: { description: 'Сильный дождь', icon: CloudRain },
  66: { description: 'Слабый переохлаждённый дождь', icon: CloudRain },
  67: { description: 'Сильный переохлаждённый дождь', icon: CloudRain },
  71: { description: 'Небольшой снег', icon: CloudSnow },
  73: { description: 'Снег', icon: CloudSnow },
  75: { description: 'Сильный снег', icon: CloudSnow },
  77: { description: 'Снежные зёрна', icon: CloudSnow },
  80: { description: 'Небольшой ливень', icon: CloudRain },
  81: { description: 'Ливень', icon: CloudRain },
  82: { description: 'Сильный ливень', icon: CloudRain },
  85: { description: 'Небольшой снежный ливень', icon: CloudSnow },
  86: { description: 'Сильный снежный ливень', icon: CloudSnow },
  95: { description: 'Гроза', icon: CloudLightning },
  96: { description: 'Гроза с небольшим градом', icon: CloudLightning },
  97: { description: 'Сильная гроза', icon: CloudLightning },
  99: { description: 'Гроза с сильным градом', icon: CloudLightning }
}

export const defaultCity: City = {
  id: 524901,
  name: 'Москва',
  latitude: 55.75204,
  longitude: 37.61781,
  country: 'Россия',
  admin1: 'Москва'
}
