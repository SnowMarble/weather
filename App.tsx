import React from 'react'
import {
  NativeBaseProvider,
  Center,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
} from 'native-base'
import Current from './components/Current'

interface Props {
  children: React.ReactNode
}

function SimpleCard() {
  const { toggleColorMode } = useColorMode()
  return (
    <Center w="80%" bg={useColorModeValue("light.100", "light.700")} rounded="xl" shadow="5" py="10">
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={useColorModeValue('light.700', 'light.100')}
        mb="5">
        Hi There! 🖐️
      </Text>
      <Button bg="blue.400" onPress={toggleColorMode}>
        <Text color="blue.50" fontSize="md">
          Toggle Dark Mode
        </Text>
      </Button>
    </Center>
  )
}

function Background({children}: Props) {
  return (
    <Center
      flex={1}
      bg={useColorModeValue('light.200', 'light.800')}
      safeArea>{children}</Center>
  )
}

export default function App() {
  return (
    <NativeBaseProvider>
      <Background>
        <SimpleCard />
        <Current/>
      </Background>
    </NativeBaseProvider>
  )
}
