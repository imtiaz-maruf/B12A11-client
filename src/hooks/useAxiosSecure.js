import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    useEffect(() => {
        // ✅ Request interceptor - Add Authorization header
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('📤 Request with token:', config.method.toUpperCase(), config.url);
                } else {
                    console.log('⚠️ No token found for request:', config.url);
                }

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
                    localStorage.removeItem('token');
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