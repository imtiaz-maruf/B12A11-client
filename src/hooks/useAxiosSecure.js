// ============================================================================
// 4. CLIENT/src/hooks/useAxiosSecure.js - CORRECTED VERSION
// ============================================================================
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

// Create axios instance (singleton)
const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // CRITICAL: Send cookies
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    useEffect(() => {
        // Request interceptor
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                console.error('❌ Request Error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => {
                console.log(`✅ API Response: ${response.status} - ${response.config.url}`);
                return response;
            },
            async (error) => {
                const status = error.response?.status;
                const originalRequest = error.config;

                console.error('❌ API Error:', {
                    status,
                    url: originalRequest?.url,
                    message: error.response?.data?.message || error.message
                });

                // Handle authentication errors
                if (status === 401 || status === 403) {
                    console.warn('🚫 Authentication failed - redirecting to login');

                    try {
                        await logoutUser();
                    } catch (err) {
                        console.error('Logout error:', err);
                    }

                    navigate('/login', {
                        replace: true,
                        state: {
                            message: 'Your session has expired. Please login again.',
                            from: window.location.pathname
                        }
                    });
                }

                // Handle network errors
                if (!error.response) {
                    console.error('🔌 Network Error');
                    error.message = 'Network error. Please check your connection.';
                }

                return Promise.reject(error);
            }
        );

        // Cleanup
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [navigate, logoutUser]);

    return axiosSecure;
};

export default useAxiosSecure;
export { axiosSecure };