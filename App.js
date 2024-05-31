//testing the commit
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/components/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { SP_KEY } from '@env';
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StripeProvider
          publishableKey="pk_test_51OgjHMSGJh91kjRpMOEaBkoQv3UOmFU09WxBJZVBc6jtMeE76qmD4soM079S4odtrklGOfVvJxdbv04JxB3yBOpA00NWP70dWe"
          merchantIdentifier="merchant.identifier" // required for Apple Pay
          urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        >
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </StripeProvider>
      </PersistGate>
    </Provider>
  );
}
