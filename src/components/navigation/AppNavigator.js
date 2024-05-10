import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import Home from '../screens/Home';
import About from '../screens/About';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userData=useSelector(state=> state.user.user);
  console.log('user',userData);
  useEffect(() => {
    AsyncStorage.getItem('userData')
      .then(userData => {
        setIsLoggedIn(userData !== null);
        console.log(userData)
      })
      .catch(error => {
        console.error('Error reading user data from local storage:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isLoggedIn]);

  if (isLoading) {
    return null; // You can render a loading spinner or component here
  }
  

  return (
    <Stack.Navigator>
      {userData?.status === true ? (
        <>
          <Stack.Screen
            options={{ headerShown: true }}
            name="Home"
            component={Home}
          />
          <Stack.Screen
            options={{ headerShown: true }}
            name="About"
            component={About}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            options={{ headerShown: true }}
            name="Signup"
            component={Signup}
          />
          <Stack.Screen
            options={{ headerShown: true }}
            name="Login"
            component={Login}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
