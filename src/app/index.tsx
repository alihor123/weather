import { Search } from '@/assets/icons'
import { WeatherCard, WeatherForecast } from '@/components/WeatherCards'
import { defaultCity } from '@/constants/weatherConstants'
import { showMessage } from '@/helpers'
import { useStyles } from '@/hooks/useStyles'
import { getCities, getWeather, type City, type Weather } from '@/services/weather.api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type SelectedCity = {
  name: string
  latitude: number
  longitude: number
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
    }
  }))

  const [search, setSearch] = useState('')
  const [cities, setCities] = useState<City[] | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null)
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

  async function loadWeather(city: SelectedCity) {
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
          return
        }

        const { status } = await Location.requestForegroundPermissionsAsync()

        if (status !== 'granted') {
          setSelectedCity(defaultCity)
          return
        }

        const location = await Location.getCurrentPositionAsync()
        const [address] = await Location.reverseGeocodeAsync(location.coords)

        setSelectedCity({
          name: address?.city ?? 'Моё местоположение',
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        })
      }
      catch {
        setSelectedCity(defaultCity)
      }
    }

    loadCity()
  }, [])

  useEffect(() => {
    if (!selectedCity) return

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
            <WeatherCard city={selectedCity?.name} current={weather.current} />
            <WeatherForecast daily={weather.daily} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
