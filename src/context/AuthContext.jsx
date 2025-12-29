// ===========================================
// CLIENT/src/context/AuthContext.jsx - FIXED
// ===========================================

import { createContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext(null);

// Create axios instance for auth
const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 second timeout
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logoutUser = async () => {
        setLoading(true);
        try {
            localStorage.removeItem('token');
            await axiosAuth.post('/api/auth/logout').catch(() => { });
        } catch (error) {
            console.error('Backend logout error:', error);
        }
        return signOut(auth);
    };

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        });
    };

    const fetchUserRole = async (email) => {
        try {
            const token = localStorage.getItem('token');
            console.log('🔍 Fetching user role with token:', token ? 'Present' : 'Missing');

            if (!token) {
                throw new Error('No token available');
            }

            const response = await axiosAuth.get(`/api/users/${email}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('✅ User role fetched:', response.data);
            setUserRole(response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching user role:', error.response?.data || error.message);
            setUserRole(null);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔐 Auth state changed:', currentUser?.email || 'Not logged in');
            setUser(currentUser);

            if (currentUser) {
                try {
                    // ✅ Step 1: Request JWT token with detailed logging
                    console.log('📡 Requesting JWT token from backend...');
                    console.log('🌐 API URL:', import.meta.env.VITE_API_URL);
                    console.log('📧 Email:', currentUser.email);

                    const tokenResponse = await axiosAuth.post('/api/auth/jwt', {
                        email: currentUser.email
                    });

                    console.log('📨 Token response received');
                    console.log('📦 Response status:', tokenResponse.status);
                    console.log('📦 Response data:', tokenResponse.data);

                    // ✅ Step 2: Validate response structure
                    if (!tokenResponse.data) {
                        throw new Error('Empty response from server');
                    }

                    if (!tokenResponse.data.success) {
                        throw new Error(tokenResponse.data.message || 'Token request failed');
                    }

                    const token = tokenResponse.data.token;

                    if (!token) {
                        console.error('❌ Response data:', tokenResponse.data);
                        throw new Error('No token in response - check backend JWT generation');
                    }

                    console.log('✅ JWT token received');
                    console.log('🔑 Token type:', typeof token);
                    console.log('🔑 Token length:', token.length);
                    console.log('🔑 Token (first 30 chars):', token.substring(0, 30) + '...');

                    // ✅ Step 3: Save to localStorage
                    localStorage.setItem('token', token);
                    console.log('💾 Token saved to localStorage');

                    // ✅ Step 4: Verify it's saved
                    const savedToken = localStorage.getItem('token');
                    if (!savedToken) {
                        throw new Error('Failed to save token to localStorage');
                    }
                    console.log('🔍 Verified token in localStorage:', savedToken.substring(0, 30) + '...');

                    // ✅ Step 5: Wait for storage to sync
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // ✅ Step 6: Fetch user role
                    console.log('👤 Fetching user role...');
                    await fetchUserRole(currentUser.email);

                    console.log('✅ Authentication complete');

                } catch (error) {
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.error('❌ Error in auth flow:');
                    console.error('Error name:', error.name);
                    console.error('Error message:', error.message);

                    if (error.response) {
                        console.error('Response status:', error.response.status);
                        console.error('Response data:', error.response.data);
                        console.error('Response headers:', error.response.headers);
                    } else if (error.request) {
                        console.error('No response received');
                        console.error('Request:', error.request);
                    }

                    console.error('Error stack:', error.stack);
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                    // Clean up on error
                    localStorage.removeItem('token');
                    setUserRole(null);
                }
            } else {
                localStorage.removeItem('token');
                setUserRole(null);
                console.log('🚪 User logged out, token removed');
            }

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        userRole,
        loading,
        createUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        fetchUserRole
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
