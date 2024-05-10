import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import persistConfig from './persistConfig';
import userReducer from './reducer/userReducer';

const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here if needed
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
