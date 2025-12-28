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
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('📤 CLIENT REQUEST');
                    console.log('🎯 URL:', config.url);
                    console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');
                    console.log('📋 Headers:', config.headers);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                } else {
                    console.log('⚠️ NO TOKEN FOUND IN LOCALSTORAGE');
                    console.log('📍 For URL:', config.url);
                }

                return config;
            },
            (error) => {
                console.error('❌ Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => {
                console.log('✅ Response received:', response.config.url, response.status);
                return response;
            },
            async (error) => {
                const status = error.response?.status;

                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.error('❌ RESPONSE ERROR');
                console.error('🔢 Status:', status);
                console.error('🎯 URL:', error.config?.url);
                console.error('📨 Message:', error.response?.data?.message);
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                if (status === 401 || status === 403) {
                    console.log('🚪 Clearing token and logging out...');
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