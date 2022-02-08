import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { Alert } from 'react-native'
import { Center, Text, Box, useColorModeValue } from 'native-base'
import axios from 'axios'
import { OPENWEATHER } from '@env'

export default function Current() {
  interface LocationState {
    latitude?: number
    longitude?: number
  }

  const [location, setLocation] = useState<LocationState>({})
  const [geoCode, setGeoCode] = useState<Location.LocationGeocodedAddress[]|null>(null)

  const requestForgroundLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Please allow permission to access location.',
        [
          {
            text: 'cancle',
            style: 'cancel',
          },
          {
            text: 'ok',
            style: 'default',
          },
        ]
      )
      return
    }

    const {
      coords: { latitude, longitude },
    } = (await Location.getLastKnownPositionAsync()) || { coords: {} }

    setLocation({
      latitude: latitude as number,
      longitude: longitude as number,
    })

    getCurrentWeather()
  }

  const getCurrentWeather = () => {
    console.log(OPENWEATHER)
    axios
      .get('http://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat: location.latitude,
          lon: location.longitude,
          units: 'metric',
          appid: OPENWEATHER,
        },
      })
      .then((res) => {
        console.log(res.data.main)
      })
      .catch(() => {
        console.log("can't get weather information")
      })
  }

  const getLocationInformation = async () => {
    const currentGeocode = await Location.reverseGeocodeAsync({
      latitude: location.latitude as number,
      longitude: location.longitude as number,
    })

    setGeoCode(currentGeocode)
  }

  useEffect(() => {
    requestForgroundLocationPermission()
  }, [])

  return (
    <Center
      w="80%"
      bg={useColorModeValue('light.100', 'light.700')}
      rounded="xl"
      shadow="5"
      py="10"
      m="10">
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={useColorModeValue('light.700', 'light.100')}>
        Your Location
      </Text>
      <Box>
        <Text fontSize="sm">Altitude: {JSON.stringify(location.latitude)}</Text>
        <Text fontSize="sm">
          Longitude: {JSON.stringify(location.longitude)}
        </Text>
      </Box>
    </Center>
  )
}
