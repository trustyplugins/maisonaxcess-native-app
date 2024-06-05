import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import ServiceTypes from '../common/ServiceTypes';
import Header from '../Header';
import Profile from '../screens/Profile';
import Service from '../screens/Service';
import { PaperProvider,DefaultTheme } from 'react-native-paper';
import OrderSuccess from '../screens/OrderSuccess';
import Dashboard from '../screens/Dashboard';
import OrderDetails from '../screens/OrderDetails';
import VerifyOtp from '../screens/VerifyOtp';
import Layout from '../common/Layout';
import CarouselScreen from '../screens/CarouselScreen';
import { useSelector } from 'react-redux';
const Stack = createNativeStackNavigator();
const customTheme = {
  ...DefaultTheme,
  colors: {
      ...DefaultTheme.colors,
      surface: '#fff', // Ensures the background is white
  },
};
const Navigation = () => {
  const userData = useSelector(state => state.user.user);
  return (
    <PaperProvider theme={customTheme}>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}
      >
        {/* {userData?.token ? <> */}

        <Stack.Screen name="carousel">
          {props => (
            <Layout>
              <CarouselScreen {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="home">
          {props => (
            <Layout>
              <Home {...props} />
            </Layout>
          )}
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
        <Stack.Screen name="dashboard">
          {props => (
            <Layout>
              <Dashboard {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="order-details">
          {props => (
            <Layout>
              <OrderDetails {...props} />
            </Layout>
          )}
        </Stack.Screen>

        {/* </> :
          <> */}
        <Stack.Screen name="login" options={{ headerShown: false }}>
          {props => (
            <Layout>
              <Login {...props} />
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
        <Stack.Screen name="verify-otp">
          {props => (
            <Layout>
              <VerifyOtp {...props} />
            </Layout>
          )}
        </Stack.Screen>

        {/* </>} */}
      </Stack.Navigator>
    </PaperProvider>
  );
};

export default Navigation;
