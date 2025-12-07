import axios from 'axios';
import type { AxiosInstance } from 'axios';

export const createApiClient = (BASE_URL = 'http://localhost:3000'): AxiosInstance => {
    const apiClient: AxiosInstance = axios.create({
        baseURL: BASE_URL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor to add authorization token
    apiClient.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor for error handling
    apiClient.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response) {
                // Log errors but don't auto-redirect
                // Let the saga/component handle the error appropriately
                switch (error.response.status) {
                    case 401:
                        // Unauthorized - only clear tokens if not on login page
                        if (!window.location.pathname.includes('/login')) {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('refreshToken');
                        }
                        break;
                    case 403:
                        console.error('Forbidden access');
                        break;
                    case 404:
                        console.error('Resource not found');
                        break;
                    case 500:
                        console.error('Internal server error');
                        break;
                    default:
                        console.error('API error:', error.response.data);
                }
            } else if (error.request) {
                console.error('Network error:', error.request);
            } else {
                console.error('Request error:', error.message);
            }
            return Promise.reject(error);
        }
    );

    return apiClient;
};
