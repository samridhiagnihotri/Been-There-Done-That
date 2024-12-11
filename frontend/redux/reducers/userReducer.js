const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    default:
      return state;
  }
};

export default userReducer; 