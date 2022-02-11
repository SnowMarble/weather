import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { Alert } from 'react-native'
import {
  Text,
  Box,
  useColorModeValue,
  HStack,
} from 'native-base'
import axios from 'axios'
import { OPENWEATHER } from '@env'

export default function Current() {
  interface LocationObject {
    coords: {
      latitude: number
      longitude: number
    }
  }

  interface Weather {
    temp: number
  }

  const [location, setLocation] = useState<LocationObject | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)

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
    } = (await Location.getLastKnownPositionAsync()) as LocationObject

    setLocation({
      coords: {
        latitude,
        longitude,
      },
    })
  }

  const getCurrentWeather = () => {
    axios
      .get('http://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat: location?.coords.latitude,
          lon: location?.coords.longitude,
          units: 'metric',
          appid: OPENWEATHER,
        },
      })
      .then((res) => {
        const main = res.data.main
        setWeather({
          temp: main.temp as number,
        })
      })
      .catch((err) => {
        console.log("can't get weather information")
        console.log(err)
      })
  }

  const getDate = () => {
    const date = new Date()
    const readableDate = date.toDateString()
    return readableDate.split(' ').slice(0, -1).join(' ')
  }

  const init = async () => {
    await requestForgroundLocationPermission()
    await getCurrentWeather()
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Box
      w="80%"
      bg={useColorModeValue('light.100', 'light.700')}
      rounded="xl"
      shadow="5"
      p="5"
      m="10">
      <HStack display="flex" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">
          Today
        </Text>
        <Text fontSize="md">{getDate()}</Text>
      </HStack>
      <Text fontSize="4xl" fontWeight="bold" py="3">
        { weather?.temp
          ? weather?.temp + '℃'
          : 'Can\'t get weather'
        } 
      </Text>
    </Box>
  )
}
