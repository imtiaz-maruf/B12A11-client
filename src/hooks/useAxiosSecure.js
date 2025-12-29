// ===========================================
// CLIENT/src/hooks/useAxiosSecure.js
// ===========================================

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
                // ✅ ALWAYS check localStorage on EVERY request
                const token = localStorage.getItem('token');

                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📤 Preparing request to:', config.url);
                console.log('🔑 Token in localStorage:', token ? 'FOUND ✅' : 'MISSING ❌');

                if (token) {
                    // Force set the Authorization header
                    config.headers['Authorization'] = `Bearer ${token}`;
                    console.log('✅ Authorization header set');
                    console.log('🔑 Token (first 30 chars):', token.substring(0, 30) + '...');
                } else {
                    console.error('❌ NO TOKEN FOUND - Request will fail');
                }

                console.log('📋 Request headers:', config.headers);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                return config;
            },
            (error) => {
                console.error('❌ Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => {
                console.log('✅ Response:', response.status, response.config.url);
                return response;
            },
            async (error) => {
                const status = error.response?.status;

                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.error('❌ Response error:', status);
                console.error('🎯 URL:', error.config?.url);
                console.error('📨 Message:', error.response?.data?.message);
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                if (status === 401 || status === 403) {
                    console.log('🚪 Unauthorized - clearing token and logging out...');
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
