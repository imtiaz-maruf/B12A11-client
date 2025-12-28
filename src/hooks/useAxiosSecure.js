import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

// ✅ Create axios instance with credentials
const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // CRITICAL: This sends cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    useEffect(() => {
        // ✅ Request interceptor
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                console.log('📤 Request:', config.method.toUpperCase(), config.url);
                return config;
            },
            (error) => {
                console.error('❌ Request error:', error);
                return Promise.reject(error);
            }
        );

        // ✅ Response interceptor
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => {
                console.log('✅ Response:', response.config.url, response.status);
                return response;
            },
            async (error) => {
                const status = error.response?.status;

                console.error('❌ Response error:', {
                    status,
                    url: error.config?.url,
                    message: error.response?.data?.message
                });

                if (status === 401 || status === 403) {
                    console.log('🚪 Unauthorized - logging out...');
                    try {
                        await logoutUser();
                    } catch (err) {
                        console.error('Logout error:', err);
                    }
                    navigate('/login', { replace: true });
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