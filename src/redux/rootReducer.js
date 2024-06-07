import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import persistConfig from './persistConfig';
import userReducer from './reducer/userReducer';
import serviceReducer from './reducer/serviceReducer';
const rootReducer = combineReducers({
  user: userReducer,
  services: serviceReducer,
  // Add other reducers here if needed
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
