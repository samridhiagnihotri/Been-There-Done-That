// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    userLogin: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    userLogout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

export const { userLogin, userLogout } = userSlice.actions;
export default userSlice.reducer;
