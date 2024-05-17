import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import About from '../screens/About';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import ServiceTypes from '../common/ServiceTypes';
import Header from '../Header';
import Profile from '../screens/Profile';
import Service from '../screens/Service';
import { PaperProvider } from 'react-native-paper';
import OrderSuccess from '../screens/OrderSuccess';
import Layout from '../common/Layout';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <PaperProvider>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}
      >
        <Stack.Screen name="home">
          {props => (
            <Layout>
              <Home {...props} />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="about">
          {
            props => (
              <Layout>
                <About {...props} />
              </Layout>
            )
          }
        </Stack.Screen>

        <Stack.Screen name="service_types">
          {props => (
            <Layout>
              <ServiceTypes {...props} />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="profile">
          {props => (
            <Layout>
              <Profile {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="service">
          {props => (
            <Layout>
              <Service {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="order-success">
          {props => (
            <Layout>
              <OrderSuccess {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="signup" options={{ headerShown: false }}>
          {props => (
            <Layout>
              <Signup {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="login" options={{ headerShown: false }}>
          {props => (
            <Layout>
              <Login {...props} />
            </Layout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </PaperProvider>
  );
};

export default Navigation;
