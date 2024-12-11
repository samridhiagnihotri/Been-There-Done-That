import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.total = existingItem.price * existingItem.quantity;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
          total: action.payload.price
        });
      }
      state.total = state.items.reduce((sum, item) => sum + item.total, 0);
    },
    updateCartItem: (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.total = state.items.reduce((sum, item) => sum + item.total, 0);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.total, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

export const { addToCart, updateCartItem, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
