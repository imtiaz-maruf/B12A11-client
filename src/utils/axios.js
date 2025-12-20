// ===========================================
// FILE 5: CLIENT/src/utils/axios.js - COMPLETE REWRITE
// ===========================================
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.response?.data);

        if (error.response?.status === 401) {
            console.log('Unauthorized - redirecting to login');
            // Don't redirect here, let the component handle it
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;