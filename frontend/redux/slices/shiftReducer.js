// redux/reducers/shiftReducer.js
const initialState = {
    shifts: [], // Array of shifts
  };
  
  const shiftReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_SHIFTS":
        return {
          ...state,
          shifts: action.payload, // Set the shifts from the payload
        };
      default:
        return state;
    }
  };
  
  export default shiftReducer;
  