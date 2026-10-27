import { Droplets, Gauge, Wind } from '@/assets/icons'
import { weatherCodes } from '@/constants/weatherConstants'
import { useStyles } from '@/hooks/useStyles'
import type { Weather } from '@/services/weather.api'
import { Image } from 'expo-image'
import { Text, View } from 'react-native'

type WeatherCardProps = {
  city: string | undefined
  current: Weather['current']
}

type WeatherForecastProps = {
  daily: Weather['daily']
}

export function WeatherCard({ city, current }: WeatherCardProps) {
  const styles = useStyles((colors) => ({
    weather: {
      padding: 24,
      borderRadius: 24,
      backgroundColor: colors.surfaceSoft
    },
    city: {
      fontSize: 22,
      fontWeight: '600',
      color: colors.text
    },
    weatherDate: {
      marginTop: 6,
      fontSize: 14,
      color: colors.textSecondary
    },
    weatherMain: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      marginTop: 20
    },
    weatherInfo: {
      flex: 1,
      gap: 4
    },
    temperature: {
      fontSize: 56,
      fontWeight: '600',
      color: colors.text
    },
    weatherDescription: {
      fontSize: 16,
      lineHeight: 22,
      color: colors.textSecondary
    },
    weatherFeelsLike: {
      marginTop: 16,
      fontSize: 14,
      color: colors.textSecondary
    },
    weatherIcon: {
      width: 76,
      height: 76,
      tintColor: colors.primary
    },
    details: {
      flexDirection: 'row',
      gap: 12
    },
    detail: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
      paddingHorizontal: 4,
      paddingVertical: 16,
      gap: 8,
      borderRadius: 20,
      backgroundColor: colors.surfaceSoft
    },
    detailIcon: {
      width: 24,
      height: 24,
      tintColor: colors.primary
    },
    detailTitle: {
      fontSize: 12,
      color: colors.textSecondary
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text
    },
    detailUnit: {
      fontSize: 12,
      color: colors.textSecondary
    }
  }))

  const weatherInfo = weatherCodes[current.weather_code] ?? weatherCodes[-1]

  const weatherDetails = [
    { title: 'Влажность', value: `${current.relative_humidity_2m}%`, unit: 'воздуха', icon: Droplets },
    { title: 'Ветер', value: current.wind_speed_10m.toLocaleString('ru-RU'), unit: 'м/с', icon: Wind },
    { title: 'Давление', value: Math.round(current.surface_pressure * 0.750062), unit: 'мм рт. ст.', icon: Gauge }
  ]

  return (
    <>
      <View style={styles.weather}>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.weatherDate}>
          {new Date(`${current.time.split('T')[0]}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
        </Text>
        <View style={styles.weatherMain}>
          <View style={styles.weatherInfo}>
            <Text style={styles.temperature}>
              {Math.round(current.temperature_2m) > 0 && '+'}{Math.round(current.temperature_2m)}°
            </Text>
            <Text style={styles.weatherDescription}>{weatherInfo.description}</Text>
          </View>
          <Image
            source={(current.is_day === 0 && weatherInfo.nightIcon) || weatherInfo.icon}
            style={styles.weatherIcon}
            tintColor={styles.weatherIcon.tintColor}
            contentFit="contain"
          />
        </View>
        <Text style={styles.weatherFeelsLike}>
          Ощущается как {Math.round(current.apparent_temperature) > 0 && '+'}{Math.round(current.apparent_temperature)}°
        </Text>
      </View>

      <View style={styles.details}>
        {weatherDetails.map(detail => (
          <View key={detail.title} style={styles.detail}>
            <Image source={detail.icon} style={styles.detailIcon} tintColor={styles.detailIcon.tintColor} contentFit="contain" />
            <Text style={styles.detailTitle}>{detail.title}</Text>
            <Text style={styles.detailValue}>{detail.value}</Text>
            <Text style={styles.detailUnit}>{detail.unit}</Text>
          </View>
        ))}
      </View>
    </>
  )
}

export function WeatherForecast({ daily }: WeatherForecastProps) {
  const styles = useStyles((colors) => ({
    forecast: {
      gap: 12
    },
    forecastTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text
    },
    forecastHeader: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12
    },
    forecastMaxLabel: {
      width: 40,
      textAlign: 'right',
      fontSize: 12,
      color: colors.textSecondary
    },
    forecastMinLabel: {
      width: 32,
      textAlign: 'right',
      fontSize: 12,
      color: colors.textSecondary
    },
    forecastDay: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12
    },
    forecastInfo: {
      flex: 1,
      gap: 4
    },
    forecastDayTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text
    },
    forecastDescription: {
      fontSize: 14,
      color: colors.textSecondary
    },
    forecastIcon: {
      width: 32,
      height: 32,
      tintColor: colors.primary
    },
    forecastTemperatures: {
      flexDirection: 'row',
      gap: 12
    },
    forecastMax: {
      width: 40,
      textAlign: 'right',
      fontSize: 16,
      fontWeight: '600',
      color: colors.text
    },
    forecastMin: {
      width: 32,
      textAlign: 'right',
      fontSize: 16,
      color: colors.textSecondary
    }
  }))

  function getForecast() {
    return daily.time.map((date, index) => {
      const info = weatherCodes[daily.weather_code[index]] ?? weatherCodes[-1]
      let title = new Date(`${date}T00:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })

      if (index === 0) title = 'Сегодня'
      if (index === 1) title = 'Завтра'

      return {
        date,
        title,
        description: info.description,
        temperatureMax: Math.round(daily.temperature_2m_max[index]),
        temperatureMin: Math.round(daily.temperature_2m_min[index]),
        icon: info.icon
      }
    })
  }

  const forecast = getForecast()

  return (
    <View style={styles.forecast}>
      <Text style={styles.forecastTitle}>Прогноз на 5 дней</Text>
      <View style={styles.forecastHeader}>
        <Text style={styles.forecastMaxLabel}>Макс.</Text>
        <Text style={styles.forecastMinLabel}>Мин.</Text>
      </View>
      {forecast.map(day => (
        <View key={day.date} style={styles.forecastDay}>
          <View style={styles.forecastInfo}>
            <Text style={styles.forecastDayTitle}>{day.title}</Text>
            <Text style={styles.forecastDescription}>{day.description}</Text>
          </View>
          <Image source={day.icon} style={styles.forecastIcon} tintColor={styles.forecastIcon.tintColor} contentFit="contain" />
          <View style={styles.forecastTemperatures}>
            <Text style={styles.forecastMax}>{day.temperatureMax > 0 && '+'}{day.temperatureMax}°</Text>
            <Text style={styles.forecastMin}>{day.temperatureMin > 0 && '+'}{day.temperatureMin}°</Text>
          </View>
        </View>
      ))}
    </View>
  )
}
