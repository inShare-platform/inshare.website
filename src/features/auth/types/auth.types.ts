// Auth Types and Interfaces

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'user';
  isActive: boolean;
  isFirstLogin: boolean;
  createdAt?: string;
  updatedAt?: string;
  organization?: Organization;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  websiteUrl?: string;
  numberOfPeople?: number;
  plan?: string;
  approved: boolean;
  isEnabled: boolean;
  features?: OrganizationFeature[];
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationFeature {
  name: string;
  enabled: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
    requirePasswordChange?: boolean;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requirePasswordChange: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
