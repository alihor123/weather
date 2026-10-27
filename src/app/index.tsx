import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Droplets, Gauge, Moon, Search, Sun, Wind } from '@/assets/icons'
import { showMessage } from '@/helpers'
import { useStyles } from '@/hooks/useStyles'
import { getCities, getWeather, type City, type Weather } from '@/services/weather.api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image, type ImageProps } from 'expo-image'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const weatherCodes: Record<number, { description: string, icon: ImageProps['source'], nightIcon?: ImageProps['source'] }> = {
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

const defaultCity: City = {
  id: 524901,
  name: 'Москва',
  latitude: 55.75204,
  longitude: 37.61781,
  country: 'Россия',
  admin1: 'Москва'
}

export default function Index() {
  const styles = useStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    scroll: {
      flex: 1
    },
    content: {
      minHeight: '100%',
      flexGrow: 1,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
      padding: 24,
      gap: 24
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text
    },
    search: {
      position: 'relative',
      justifyContent: 'center',
      zIndex: 2
    },
    searchBackdrop: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1
    },
    searchResults: {
      position: 'absolute',
      left: 24,
      right: 24,
      zIndex: 3,
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: colors.surface,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
    },
    searchResultsScroll: {
      maxHeight: 280,
      flexGrow: 0
    },
    searchResult: {
      paddingHorizontal: 20,
      paddingVertical: 14,
      gap: 4
    },
    searchResultTitle: {
      fontSize: 16,
      color: colors.text
    },
    searchResultDescription: {
      fontSize: 13,
      color: colors.textSecondary
    },
    searchEmpty: {
      padding: 20,
      fontSize: 14,
      color: colors.textSecondary
    },
    buttonPressed: {
      opacity: 0.6
    },
    searchInput: {
      height: 52,
      borderRadius: 999,
      paddingLeft: 20,
      paddingRight: 56,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surfaceSoft
    },
    placeholder: {
      color: colors.textSecondary
    },
    searchIcon: {
      position: 'absolute',
      right: 20,
      width: 24,
      height: 24,
      tintColor: colors.textSecondary
    },
    weatherStatus: {
      flex: 1,
      minHeight: 200,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    },
    loader: {
      color: colors.primary
    },
    weatherError: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.textSecondary
    },
    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 999,
      backgroundColor: colors.primary
    },
    retryButtonText: {
      fontSize: 16,
      color: colors.onPrimary
    },
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
    },
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

  const [search, setSearch] = useState('')
  const [cities, setCities] = useState<City[] | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [searchBottom, setSearchBottom] = useState(0)
  const [weather, setWeather] = useState<Weather | null>(null)
  const [isWeatherLoading, setIsWeatherLoading] = useState(true)
  const [isWeatherLoadError, setIsWeatherLoadError] = useState(false)

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function searchCities(text: string) {
    setSearch(text)
    setCities(null)
    setIsOpen(true)

    if (searchTimerRef.current !== null) {
      clearTimeout(searchTimerRef.current)
      searchTimerRef.current = null
    }

    if (!text.trim()) return

    const timer = setTimeout(async function () {
      try {
        const data = await getCities(text)

        if (searchTimerRef.current !== timer) return

        setCities(data)
      }
      catch {
        if (searchTimerRef.current === timer) {
          showMessage('Не удалось загрузить города. Попробуйте позже')
        }
      }
      finally {
        if (searchTimerRef.current === timer) {
          searchTimerRef.current = null
        }
      }
    }, 200)

    searchTimerRef.current = timer
  }

  async function loadWeather(city: City) {
    setIsWeatherLoading(true)
    setIsWeatherLoadError(false)
    setIsOpen(false)

    try {
      const data = await getWeather(city.latitude, city.longitude)
      setWeather(data)
    }
    catch {
      setIsWeatherLoadError(true)
    }
    finally {
      setIsWeatherLoading(false)
    }
  }

  async function selectCity(city: City) {
    try {
      await AsyncStorage.setItem('city', JSON.stringify(city))
      setSelectedCity({ ...city })
      setSearch(city.name)
      setIsOpen(false)
    }
    catch {
      showMessage('Не удалось сохранить выбранный город. Попробуйте позже')
    }
  }

  useEffect(() => {
    async function loadCity() {
      try {
        const data = await AsyncStorage.getItem('city')

        if (data) {
          const city: City = JSON.parse(data)
          setSelectedCity(city)
        }
        else {
          setSelectedCity(defaultCity)
        }
      }
      catch {
        setSelectedCity(defaultCity)
        showMessage('Не удалось загрузить выбранный город. Попробуйте позже')
      }
    }

    loadCity()
  }, [])

  useEffect(() => {
    if (!selectedCity) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadWeather(selectedCity)
  }, [selectedCity])

  useEffect(() => {
    return () => {
      if (searchTimerRef.current !== null) {
        clearTimeout(searchTimerRef.current)
        searchTimerRef.current = null
      }
    }
  }, [])

  const weatherInfo = weatherCodes[weather?.current.weather_code ?? -1] ?? weatherCodes[-1]

  const forecast = weather?.daily.time.map((date, index) => {
    const info = weatherCodes[weather.daily.weather_code[index]] ?? weatherCodes[-1]
    let title = new Date(`${date}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })

    if (index === 0) title = 'Сегодня'
    if (index === 1) title = 'Завтра'

    return {
      date,
      title,
      description: info.description,
      temperatureMax: Math.round(weather.daily.temperature_2m_max[index]),
      temperatureMin: Math.round(weather.daily.temperature_2m_min[index]),
      icon: info.icon
    }
  })

  const weatherDetails = weather && [
    { title: 'Влажность', value: `${weather.current.relative_humidity_2m}%`, unit: 'воздуха', icon: Droplets },
    { title: 'Ветер', value: weather.current.wind_speed_10m.toLocaleString('ru-RU'), unit: 'м/с', icon: Wind },
    { title: 'Давление', value: Math.round(weather.current.surface_pressure * 0.750062), unit: 'мм рт. ст.', icon: Gauge }
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
      >
        <Text style={styles.title}>Погода</Text>

        <View
          style={styles.search}
          onLayout={event => setSearchBottom(event.nativeEvent.layout.y + event.nativeEvent.layout.height)}
        >
          <TextInput
            value={search}
            editable={!isWeatherLoading}
            onChangeText={searchCities}
            onFocus={() => setIsOpen(true)}
            onPressIn={() => setIsOpen(true)}
            style={styles.searchInput}
            placeholder={'Название города'}
            placeholderTextColor={styles.placeholder.color}
            returnKeyType="search"
          />
          <Image source={Search} style={styles.searchIcon} tintColor={styles.searchIcon.tintColor} contentFit="contain" pointerEvents="none" />
        </View>

        {!isWeatherLoading && isOpen && cities && (
          <View style={[styles.searchResults, { top: searchBottom + 8 }]}>
            <ScrollView
              style={styles.searchResultsScroll}
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled
            >
              {cities.length === 0 && (
                <Text style={styles.searchEmpty}>Ничего не найдено</Text>
              )}

              {cities.length > 0 && cities.map(city => (
                <Pressable
                  key={city.id}
                  onPress={() => selectCity(city)}
                  style={({ pressed }) => [styles.searchResult, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.searchResultTitle}>{city.name}</Text>
                  <Text style={styles.searchResultDescription}>
                    {city.admin1}
                    {city.admin1 && city.country && ', '}
                    {city.country}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {!isWeatherLoading && isOpen && cities && (
          <Pressable style={styles.searchBackdrop} onPress={() => setIsOpen(false)} />
        )}

        {isWeatherLoading && (
          <View style={styles.weatherStatus}>
            <ActivityIndicator size="large" color={styles.loader.color} />
          </View>
        )}

        {!isWeatherLoading && isWeatherLoadError && (
          <View style={styles.weatherStatus}>
            <Text style={styles.weatherError}>Не удалось загрузить погоду</Text>
            <Pressable
              onPress={() => selectedCity && loadWeather(selectedCity)}
              style={({ pressed }) => [styles.retryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.retryButtonText}>Повторить</Text>
            </Pressable>
          </View>
        )}

        {!isWeatherLoading && !isWeatherLoadError && weather && (
          <>
            <View style={styles.weather}>
              <Text style={styles.city}>{selectedCity?.name}</Text>
              <Text style={styles.weatherDate}>
                {new Date(`${weather.current.time.split('T')[0]}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
              </Text>
              <View style={styles.weatherMain}>
                <View style={styles.weatherInfo}>
                  <Text style={styles.temperature}>
                    {Math.round(weather.current.temperature_2m) > 0 && '+'}{Math.round(weather.current.temperature_2m)}°
                  </Text>
                  <Text style={styles.weatherDescription}>{weatherInfo.description}</Text>
                </View>
                <Image
                  source={(weather.current.is_day === 0 && weatherInfo.nightIcon) || weatherInfo.icon}
                  style={styles.weatherIcon}
                  tintColor={styles.weatherIcon.tintColor}
                  contentFit="contain"
                />
              </View>
              <Text style={styles.weatherFeelsLike}>
                Ощущается как {Math.round(weather.current.apparent_temperature) > 0 && '+'}{Math.round(weather.current.apparent_temperature)}°
              </Text>
            </View>

            <View style={styles.details}>
              {weatherDetails?.map(detail => (
                <View key={detail.title} style={styles.detail}>
                  <Image source={detail.icon} style={styles.detailIcon} tintColor={styles.detailIcon.tintColor} contentFit="contain" />
                  <Text style={styles.detailTitle}>{detail.title}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                  <Text style={styles.detailUnit}>{detail.unit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.forecast}>
              <Text style={styles.forecastTitle}>Прогноз на 5 дней</Text>
              <View style={styles.forecastHeader}>
                <Text style={styles.forecastMaxLabel}>Макс.</Text>
                <Text style={styles.forecastMinLabel}>Мин.</Text>
              </View>
              {forecast?.map(day => (
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
