// reducers/userReducer.js
const initialState = {
  user: null,
  isLoggedIn: false,
  credentials: null,
  userDetails:null,
  serviceDetail:null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
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
      return {
        ...state,
        serviceDetail: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
