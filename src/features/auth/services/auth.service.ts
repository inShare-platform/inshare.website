// Auth Service - Handles all authentication API calls
import { createApiClient } from '../../../client/client';
import type { 
  LoginRequest, 
  LoginResponse, 
  ChangePasswordRequest,
  User,
  ApiResponse 
} from '../types/auth.types';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || 'https://api.inshare.in/api/v1/auth';

class AuthService {
  private client: AxiosInstance;

  constructor() {
    this.client = createApiClient(API_BASE_URL);
    // Bind methods to preserve 'this' context
    this.login = this.login.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  /**
   * Login user (super admin or regular user)
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/login', credentials);
    return response.data;
  }

  /**
   * Get current authenticated user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.client.get<ApiResponse<User>>('/me');
    return response.data;
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    const response = await this.client.put<ApiResponse<null>>('/change-password', data);
    return response.data;
  }

  /**
   * Logout user (client-side token cleanup)
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Store tokens in localStorage
   */
  storeTokens(token: string, refreshToken: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
