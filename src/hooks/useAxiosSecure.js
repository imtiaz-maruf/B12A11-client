// ===========================================
// CLIENT/src/hooks/useAxiosSecure.js
// ===========================================

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true // ✅ Crucial for cross-site cookie sending
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    axiosSecure.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    });

    axiosSecure.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                await logoutUser();
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;