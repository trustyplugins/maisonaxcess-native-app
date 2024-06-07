// reducers/userReducer.js
const initialState = {
  user: null,
  credentials: null,
  userDetails: null,
  serviceDetail: null,
  cachedServiceTypes: null,
  cachedServiceTypesTimestamp: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    case 'SAVE_CREDENTIALS': //remember me
      return {
        ...state,
        credentials: action.payload,
      };
    case 'SIGNUP': //remember me
      return {
        ...state,
        userDetails: action.payload,
      };
    case 'ADD_SERVICE':
      let updatedAddresses = [];
      if (state.serviceDetail) {
        updatedAddresses = state.serviceDetail.filter(
          addr => addr.id !== action.payload.id
        );
      }
      return {
        ...state,
        serviceDetail: [...updatedAddresses, action.payload],
      };
    case 'REMOVE_SERVICE':
      return {
        ...state,
        serviceDetail: null,
      };
    case 'SET_SERVICE_TYPES':
      return {
        ...state,
        cachedServiceTypes: action.payload,
        cachedServiceTypesTimestamp: new Date(),
      };
    case 'REMOVE_SERVICES':
      return {
        ...state,
        cachedServiceTypes: {},
        cachedServiceTypesTimestamp: {},
      };
    default:
      return state;
  }
};

export default userReducer;
