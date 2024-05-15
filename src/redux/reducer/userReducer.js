// reducers/userReducer.js
const initialState = {
  user: null,
  isLoggedIn: false,
  credentials: null,
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
    case 'SAVE_CREDENTIALS':
      return {
        ...state,
        credentials: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
