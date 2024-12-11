// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import foodReducer from "./slices/foodSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice"; // Ensure this import points to your orderSlice
import shiftReducer from "./slices/shiftReducer"; 
import authReducer from './slices/authSlice';// Ensure this path is correct based on your folder structure

// Create and configure the Redux store
export const store = configureStore({
  reducer: {
    user: userReducer,
    food: foodReducer,
    cart: cartReducer,
    order: orderReducer,
    shift: shiftReducer,
    auth: authReducer
  },
});
