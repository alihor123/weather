import { Cloud, CloudRain, CloudSun, Droplets, Gauge, Search, Sun, Wind } from '@/assets/icons'
import { useStyles } from '@/hooks/useStyles'
import { Image } from 'expo-image'
import { ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
          <Text style={styles.city}>Екатеринбург</Text>
          <Text style={styles.weatherDate}>Сегодня, 27 октября</Text>
          <View style={styles.weatherMain}>
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>+8°</Text>
              <Text style={styles.weatherDescription}>Переменная облачность</Text>
            </View>
            <Image source={CloudSun} style={styles.weatherIcon} tintColor={styles.weatherIcon.tintColor} contentFit="contain" />
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detail}>
            <Image source={Droplets} style={styles.detailIcon} tintColor={styles.detailIcon.tintColor} contentFit="contain" />
            <Text style={styles.detailTitle}>Влажность</Text>
            <Text style={styles.detailValue}>64%</Text>
            <Text style={styles.detailUnit}>воздуха</Text>
          </View>
          <View style={styles.detail}>
            <Image source={Wind} style={styles.detailIcon} tintColor={styles.detailIcon.tintColor} contentFit="contain" />
            <Text style={styles.detailTitle}>Ветер</Text>
            <Text style={styles.detailValue}>3,2</Text>
            <Text style={styles.detailUnit}>м/с</Text>
          </View>
          <View style={styles.detail}>
            <Image source={Gauge} style={styles.detailIcon} tintColor={styles.detailIcon.tintColor} contentFit="contain" />
            <Text style={styles.detailTitle}>Давление</Text>
            <Text style={styles.detailValue}>748</Text>
            <Text style={styles.detailUnit}>мм рт. ст.</Text>
          </View>
        </View>

        <View style={styles.forecast}>
          <Text style={styles.forecastTitle}>Прогноз на 3 дня</Text>
          <View style={styles.forecastDay}>
            <View style={styles.forecastInfo}>
              <Text style={styles.forecastDayTitle}>Сегодня</Text>
              <Text style={styles.forecastDescription}>Ясно</Text>
            </View>
            <Image source={Sun} style={styles.forecastIcon} tintColor={styles.forecastIcon.tintColor} contentFit="contain" />
            <View style={styles.forecastTemperatures}>
              <Text style={styles.forecastMax}>+10°</Text>
              <Text style={styles.forecastMin}>+2°</Text>
            </View>
          </View>
          <View style={styles.forecastDay}>
            <View style={styles.forecastInfo}>
              <Text style={styles.forecastDayTitle}>Завтра</Text>
              <Text style={styles.forecastDescription}>Облачно</Text>
            </View>
            <Image source={Cloud} style={styles.forecastIcon} tintColor={styles.forecastIcon.tintColor} contentFit="contain" />
            <View style={styles.forecastTemperatures}>
              <Text style={styles.forecastMax}>+9°</Text>
              <Text style={styles.forecastMin}>+3°</Text>
            </View>
          </View>
          <View style={styles.forecastDay}>
            <View style={styles.forecastInfo}>
              <Text style={styles.forecastDayTitle}>29 октября</Text>
              <Text style={styles.forecastDescription}>Дождь</Text>
            </View>
            <Image source={CloudRain} style={styles.forecastIcon} tintColor={styles.forecastIcon.tintColor} contentFit="contain" />
            <View style={styles.forecastTemperatures}>
              <Text style={styles.forecastMax}>+7°</Text>
              <Text style={styles.forecastMin}>+1°</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
