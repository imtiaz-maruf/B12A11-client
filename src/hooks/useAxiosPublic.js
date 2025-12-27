// ============================================================================
// 5. CLIENT/src/hooks/useAxiosPublic.js - NEW FILE
// ============================================================================
import axios from 'axios';

const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Still needed for login to set cookies
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add logging
axiosPublic.interceptors.request.use(
    (config) => {
        console.log(`🟢 Public Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Public Request Error:', error);
        return Promise.reject(error);
    }
);

axiosPublic.interceptors.response.use(
    (response) => {
        console.log(`✅ Public Response: ${response.status}`);
        return response;
    },
    (error) => {
        console.error('❌ Public Response Error:', error.response?.data);
        return Promise.reject(error);
    }
);

const useAxiosPublic = () => axiosPublic;

export default useAxiosPublic;
export { axiosPublic };