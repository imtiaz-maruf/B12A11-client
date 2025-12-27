// ============================================================================
// CRITICAL FIX 3: Add Detailed Logging to useAxiosSecure
// CLIENT/src/hooks/useAxiosSecure.js
// ============================================================================

import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // CRITICAL
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
                // ✅ Log ALL cookies being sent
                const cookies = document.cookie;
                console.log('🔵 API Request:', config.method?.toUpperCase(), config.url);
                console.log('🍪 Browser cookies:', cookies || 'NONE');
                console.log('📋 WithCredentials:', config.withCredentials);
                console.log('🌐 Request headers:', config.headers);

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
                console.log('✅ API Response:', response.status, response.config.url);
                return response;
            },
            async (error) => {
                const status = error.response?.status;
                const url = error.config?.url;

                console.error('❌ API Error:', {
                    status,
                    url,
                    message: error.response?.data?.message,
                    cookies: document.cookie
                });

                // Handle auth errors
                if (status === 401 || status === 403) {
                    console.warn('🚫 Authentication failed - redirecting to login');
                    console.log('🍪 Cookies at failure:', document.cookie);

                    try {
                        await logoutUser();
                    } catch (err) {
                        console.error('Logout error:', err);
                    }

                    navigate('/login', {
                        replace: true,
                        state: {
                            message: 'Session expired. Please login again.',
                            from: window.location.pathname
                        }
                    });
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [navigate, logoutUser]);

    return axiosSecure;
};

export default useAxiosSecure;
export { axiosSecure };