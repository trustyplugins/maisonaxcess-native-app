import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from '../screens/Home';
import About from '../screens/About';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import { SafeAreaView } from 'react-native';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="About"
        component={About}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Signup"
        component={Signup}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          header: ({ navigation }) => {
            const goToSignup = () => {
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
    </Stack.Navigator>
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
