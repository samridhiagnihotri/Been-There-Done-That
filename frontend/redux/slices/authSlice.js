import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) || null : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') || null : null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer; 