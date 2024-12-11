// slices/orderSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload; // Set the orders array
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload); // Add a new order
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(order => order.id !== action.payload.id); // Remove an order
    },
  },
});

export const { setOrders, addOrder, removeOrder } = orderSlice.actions;
export default orderSlice.reducer;








// // slices/orderSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   orders: [], // Initialize with an empty array for orders
// };

// const orderSlice = createSlice({
//   name: "order",
//   initialState,
//   reducers: {
//     setOrders(state, action) {
//       state.orders = action.payload;
//     },
//     clearOrders(state) {
//       state.orders = [];
//     },
//   },
// });

// export const { setOrders, clearOrders } = orderSlice.actions;
// export default orderSlice.reducer;
