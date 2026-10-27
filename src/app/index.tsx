import { Cloud, CloudRain, CloudSun, Droplets, Gauge, Search, Sun, Wind } from '@/assets/icons'
import { useStyles } from '@/hooks/useStyles'
import { Image } from 'expo-image'
import { ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Index() {
  const weather = {
    city: 'Екатеринбург',
    date: 'Сегодня, 27 октября',
    temperature: 8,
    feelsLike: 6,
    description: 'Переменная облачность',
    humidity: 64,
    windSpeed: 3.2,
    pressure: 748,
    icon: CloudSun
  }

  const forecast = [
    {
      date: '2026-10-27',
      title: 'Сегодня',
      description: 'Ясно',
      temperatureMax: 10,
      temperatureMin: 2,
      icon: Sun
    },
    {
      date: '2026-10-28',
      title: 'Завтра',
      description: 'Облачно',
      temperatureMax: 9,
      temperatureMin: 3,
      icon: Cloud
    },
    {
      date: '2026-10-29',
      title: '29 октября',
      description: 'Дождь',
      temperatureMax: 7,
      temperatureMin: 1,
      icon: CloudRain
    }
  ]

  const weatherDetails = [
    { title: 'Влажность', value: `${weather.humidity}%`, unit: 'воздуха', icon: Droplets },
    { title: 'Ветер', value: weather.windSpeed.toLocaleString('ru-RU'), unit: 'м/с', icon: Wind },
    { title: 'Давление', value: weather.pressure, unit: 'мм рт. ст.', icon: Gauge }
  ]

  const styles = useStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    scroll: {
      flex: 1
    },
    content: {
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
      justifyContent: 'center'
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Погода</Text>

        <View style={styles.search}>
          <TextInput
            style={styles.searchInput}
            placeholder="Название города"
            placeholderTextColor={styles.placeholder.color}
            returnKeyType="search"
          />
          <Image source={Search} style={styles.searchIcon} tintColor={styles.searchIcon.tintColor} contentFit="contain" pointerEvents="none" />
        </View>

        <View style={styles.weather}>
          <Text style={styles.city}>{weather.city}</Text>
          <Text style={styles.weatherDate}>{weather.date}</Text>
          <View style={styles.weatherMain}>
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>{weather.temperature > 0 ? '+' : ''}{weather.temperature}°</Text>
              <Text style={styles.weatherDescription}>{weather.description}</Text>
            </View>
            <Image source={weather.icon} style={styles.weatherIcon} tintColor={styles.weatherIcon.tintColor} contentFit="contain" />
          </View>
          <Text style={styles.weatherFeelsLike}>Ощущается как {weather.feelsLike > 0 ? '+' : ''}{weather.feelsLike}°</Text>
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

        <View style={styles.forecast}>
          <Text style={styles.forecastTitle}>Прогноз на 3 дня</Text>
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
                <Text style={styles.forecastMax}>{day.temperatureMax > 0 ? '+' : ''}{day.temperatureMax}°</Text>
                <Text style={styles.forecastMin}>{day.temperatureMin > 0 ? '+' : ''}{day.temperatureMin}°</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
