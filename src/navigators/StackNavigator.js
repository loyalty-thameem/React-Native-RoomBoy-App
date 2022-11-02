import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/Home';
const Stack = createNativeStackNavigator();
const StackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown:false,
            }}
            >
            <Stack.Screen
                name={'Login'}
                component={LoginScreen}
            />
            <Stack.Screen
                name={'Signup'}
                component={SignupScreen}
            />
            <Stack.Screen
                name={'Home'}
                component={HomeScreen}
            />
        </Stack.Navigator>
    )
}

export default StackNavigator

const styles = StyleSheet.create({})