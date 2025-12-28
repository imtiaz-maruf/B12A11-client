// ===========================================
// CLIENT/src/hooks/useAxiosSecure.js - COMPLETE REWRITE
// ===========================================
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

// ✅ CRITICAL: Create axios instance with proper config
const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // ✅ Always send cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    useEffect(() => {
        // Request interceptor
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                console.log('📤 Making request to:', config.url);
                console.log('🍪 WithCredentials:', config.withCredentials);
                return config;
            },
            (error) => {
                console.error('❌ Request error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => {
                console.log('✅ Response from:', response.config.url);
                return response;
            },
            async (error) => {
                const status = error.response?.status;
                const url = error.config?.url;

                console.error('❌ Axios Error:', {
                    status,
                    url,
                    message: error.response?.data?.message,
                    authenticated: error.response?.data?.authenticated
                });

                // Handle 401/403 errors
                if (status === 401 || status === 403) {
                    console.log('🔒 Authentication failed, logging out...');
                    try {
                        await logoutUser();
                    } catch (err) {
                        console.error('Logout error:', err);
                    }
                    navigate('/login', {
                        replace: true,
                        state: {
                            message: 'Your session has expired. Please login again.'
                        }
                    });
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