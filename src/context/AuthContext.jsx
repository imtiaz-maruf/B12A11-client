// ===========================================
// CLIENT/src/context/AuthContext.jsx
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

// Create axios instance with credentials
const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
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
            // Clear backend token
            await axiosAuth.post('/api/auth/logout');
        } catch (error) {
            console.error('Backend logout error:', error);
        }
        // Clear Firebase auth
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
            console.log('Fetching user role for:', email);
            const response = await axiosAuth.get(`/api/users/${email}`);
            console.log('User role fetched:', response.data);
            setUserRole(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching user role:', error.response?.data || error.message);
            setUserRole(null);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log('Auth state changed:', currentUser?.email);
            setUser(currentUser);

            if (currentUser) {
                try {
                    // Get JWT token from backend
                    console.log('Getting JWT token...');
                    const tokenResponse = await axiosAuth.post('/api/auth/jwt', {
                        email: currentUser.email
                    });
                    console.log('JWT token response:', tokenResponse.data);

                    // Fetch user role
                    await fetchUserRole(currentUser.email);

                } catch (error) {
                    console.error('Error in auth flow:', error.response?.data || error.message);
                    // Don't set loading to false yet, will be set below
                }
            } else {
                setUserRole(null);
            }

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
