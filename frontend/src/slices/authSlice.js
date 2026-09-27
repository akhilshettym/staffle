import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: storedUser?.user || null,
  token: Boolean(storedUser?.user),
  role: storedUser?.role || null,

  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {

    setCredentials: (state, action) => {
      const { user, role } = action.payload;

      state.user = user;
      state.token = Boolean(user);
      state.role = role;

      localStorage.setItem("user", JSON.stringify({ user, role }));
    },

      
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;

      localStorage.removeItem("user");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
