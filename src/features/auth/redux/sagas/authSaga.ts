// Auth Redux Saga - Handle async authentication operations
import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';
import {
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
} from '../slices/authSlice';
import type { 
  LoginRequest, 
  LoginResponse, 
  ChangePasswordRequest,
  ApiResponse,
  User 
} from '../../types/auth.types';

/**
 * Login saga - Handle user login
 */
function* handleLogin(action: PayloadAction<LoginRequest>): Generator<any, void, LoginResponse> {
  try {
    const response: LoginResponse = yield call(authService.login, action.payload);

    // Check if the response indicates success
    if (response.success === false) {
      // API returned success: false in response body
      const errorMessage = response.message || 'Login failed. Please check your credentials.';
      yield put(loginFailure(errorMessage));
      return;
    }

    if (response.success && response.data) {
      // Store tokens in localStorage
      authService.storeTokens(response.data.token, response.data.refreshToken);

      // Dispatch success action
      yield put(loginSuccess({
        user: response.data.user,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        requirePasswordChange: response.data.requirePasswordChange,
      }));
    } else {
      yield put(loginFailure('Login failed. Please try again.'));
    }
  } catch (error: any) {
    // Handle HTTP errors (401, 500, etc.)
    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'An error occurred during login';
    yield put(loginFailure(errorMessage));
  }
}

/**
 * Get current user saga
 */
function* handleGetCurrentUser(): Generator<any, void, ApiResponse<User>> {
  try {
    const response: ApiResponse<User> = yield call(authService.getCurrentUser);

    if (response.success && response.data) {
      yield put(getCurrentUserSuccess(response.data));
    } else {
      yield put(getCurrentUserFailure('Failed to fetch user profile'));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 
                        error.message || 
                        'An error occurred while fetching user profile';
    yield put(getCurrentUserFailure(errorMessage));
  }
}

/**
 * Change password saga
 */
function* handleChangePassword(action: PayloadAction<ChangePasswordRequest>): Generator<any, void, ApiResponse<null>> {
  try {
    const response: ApiResponse<null> = yield call(authService.changePassword, action.payload);

    if (response.success) {
      yield put(changePasswordSuccess());
    } else {
      yield put(changePasswordFailure('Failed to change password'));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 
                        error.message || 
                        'An error occurred while changing password';
    yield put(changePasswordFailure(errorMessage));
  }
}

/**
 * Logout saga
 */
function* handleLogout(): Generator<any, void, void> {
  try {
    // Clear tokens from localStorage
    authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Root auth saga - Watch for actions
 */
export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(getCurrentUserRequest.type, handleGetCurrentUser);
  yield takeLatest(changePasswordRequest.type, handleChangePassword);
  yield takeLatest(logout.type, handleLogout);
}
