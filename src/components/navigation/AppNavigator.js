import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, StyleSheet, HeaderTitle, TouchableOpacity, Platform } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import Home from '../screens/Home';
import About from '../screens/About';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userData = useSelector(state => state.user.user);
  console.log('user', userData);
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
            options={{ headerShown: false }}
            name="Signup"
            component={Signup}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: true,
              header: ({ navigation }) => {
                const goToSignup = () => {
                  // Custom navigation logic
                  navigation.navigate("Signup");
                };
                return (
                  <TouchableOpacity onPress={goToSignup} style={styles.headerButton}>
                     <Icon name="arrow-left" size={18} color="black" style={styles.arrowIcon} />
                    <Text style={styles.headerButtonText}> Signup</Text>
                  </TouchableOpacity>
                );
              },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:10,
    marginTop: 40,
    paddingBottom: 10,
  },
  headerButtonText: {
    fontSize: 21,
    color: 'black',
    maxWidth: 100, // Limiting the width to prevent overflow
    overflow: 'hidden', // Hide overflow text
    // marginTop: 40,
    // paddingBottom: 10,
    paddingLeft: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  arrowIcon: {
    marginRight: 5, // Adjust the spacing between the icon and the text
  },
});

export default Navigation;
