import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LoginScreen from './src/screens/LoginScreen'
import { NavigationContainer } from '@react-navigation/native'
import StackNavigator from './src/navigators/StackNavigator'

const App = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})