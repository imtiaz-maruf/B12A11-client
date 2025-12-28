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

const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
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
            await axiosAuth.post('/api/auth/logout').catch(() => {});
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
                    // ✅ Step 1: Get JWT token
                    console.log('📡 Requesting JWT token from backend...');
                    const tokenResponse = await axiosAuth.post('/api/auth/jwt', {
                        email: currentUser.email
                    });
                    
                    const token = tokenResponse.data.token;
                    
                    if (!token) {
                        throw new Error('No token in response');
                    }

                    console.log('✅ JWT token received');
                    console.log('🔑 Token (first 30 chars):', token.substring(0, 30) + '...');

                    // ✅ Step 2: Save to localStorage
                    localStorage.setItem('token', token);
                    console.log('💾 Token saved to localStorage');

                    // ✅ Step 3: Verify it's saved
                    const savedToken = localStorage.getItem('token');
                    console.log('🔍 Verify saved token:', savedToken ? 'Found' : 'NOT FOUND');

                    // ✅ Step 4: Wait a moment for storage to sync
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // ✅ Step 5: Fetch user role
                    console.log('👤 Fetching user role...');
                    await fetchUserRole(currentUser.email);

                    console.log('✅ Authentication complete');

                } catch (error) {
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.error('❌ Error in auth flow:', error.response?.data || error.message);
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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