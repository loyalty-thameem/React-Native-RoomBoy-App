import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LoginScreen from './src/screens/LoginScreen'
import { NavigationContainer } from '@react-navigation/native'
import StackNavigator from './src/navigators/StackNavigator'
import SplashScreen from 'react-native-splash-screen'
  
const App = () => {
  React.useEffect(()=>{
    SplashScreen.hide();
    },[]);
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})