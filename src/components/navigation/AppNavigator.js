import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Platform } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from '../screens/Home';
import About from '../screens/About';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import ServiceTypes from '../common/ServiceTypes';
import Header from '../Header';
import Profile from '../screens/Profile';
import { PaperProvider } from 'react-native-paper';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <PaperProvider>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="About"
          component={About}
        />
        <Stack.Screen
          name="ServiceTypes"
          component={ServiceTypes}
        />
        <Stack.Screen
          name="Profile"
          component={Profile} 
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 40,
    paddingBottom: 10,
  },
  headerButtonText: {
    fontSize: 21,
    color: 'black',
    maxWidth: 100,
    overflow: 'hidden',
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
