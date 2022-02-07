import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { Alert } from 'react-native'
import { Center, Text, Box, useColorModeValue } from 'native-base'
import axios from 'axios'

export default function Current() {
  interface LocationState {
    altitude?: number | null
    longitude?: number | null
  }
  const [location, setLocation] = useState<LocationState>({})

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

    const location = await Location.getLastKnownPositionAsync()

    setLocation({
      altitude: location?.coords.altitude,
      longitude: location?.coords.longitude,
    })
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
        <Text fontSize="sm">Altitude: {JSON.stringify(location.altitude)}</Text>
        <Text fontSize="sm">Longitude: {JSON.stringify(location.longitude)}</Text>
      </Box>
    </Center>
  )
}
