// Auth Redux Slice - State management for authentication
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types/auth.types';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
  error: null,
  requirePasswordChange: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginRequest: (state, _action: PayloadAction<{ email: string; password: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{
      user: User;
      token: string;
      refreshToken: string;
      requirePasswordChange?: boolean;
    }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.requirePasswordChange = action.payload.requirePasswordChange || false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = action.payload;
    },

    // Get current user actions
    getCurrentUserRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getCurrentUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    getCurrentUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Change password actions
    changePasswordRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    changePasswordSuccess: (state) => {
      state.isLoading = false;
      state.requirePasswordChange = false;
      state.error = null;
    },
    changePasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.requirePasswordChange = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set authentication from stored token
    setAuthFromStorage: (state, action: PayloadAction<{
      token: string;
      refreshToken: string;
    }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  logout,
  clearError,
  setAuthFromStorage,
} = authSlice.actions;

export default authSlice.reducer;
