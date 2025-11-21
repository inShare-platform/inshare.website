import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const createApiClient = (BASE_URL = 'http://localhost:3000') => {
    const apiClient: AxiosInstance = axios.create({
        baseURL: BASE_URL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return apiClient
}



// Request interceptor to add authorization token
createApiClient().interceptors.request.use(
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
createApiClient().interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle specific HTTP status codes
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('authToken');
                    // You might want to redirect to login page here
                    break;
                case 403:
                    // Forbidden
                    console.error('Forbidden access');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 500:
                    // Internal server error
                    console.error('Internal server error');
                    break;
                default:
                    console.error('API error:', error.response.data);
            }
        } else if (error.request) {
            // Network error
            console.error('Network error:', error.request);
        } else {
            // Other error
            console.error('Request error:', error.message);
        }
        return Promise.reject(error);
    }
);
