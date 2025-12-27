// ============================================================================
// CRITICAL FIX 1: AuthProvider - Update Login Flow
// CLIENT/src/providers/AuthProvider.jsx
// ============================================================================

import { createContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import { axiosPublic } from '../hooks/useAxiosPublic';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register user
    const registerUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result;
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const loginUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);

            // ✅ CRITICAL: Get JWT token immediately after Firebase login
            console.log('🔐 Getting JWT token for:', email);
            const tokenResponse = await axiosPublic.post('/auth/jwt', { email });
            console.log('✅ JWT token obtained:', tokenResponse.data);

            return result;
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Google login
    const googleLogin = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // ✅ CRITICAL: Get JWT token for Google user
            console.log('🔐 Getting JWT token for Google user:', result.user.email);
            const tokenResponse = await axiosPublic.post('/auth/jwt', {
                email: result.user.email
            });
            console.log('✅ JWT token obtained:', tokenResponse.data);

            return result;
        } catch (error) {
            console.error('❌ Google login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout user
    const logoutUser = async () => {
        setLoading(true);
        try {
            // Clear JWT cookie first
            console.log('🔓 Clearing JWT cookie...');
            await axiosPublic.post('/auth/logout');

            // Then sign out from Firebase
            await signOut(auth);
            console.log('✅ Logged out successfully');
        } catch (error) {
            console.error('❌ Logout error:', error);
            // Force sign out even if API fails
            await signOut(auth);
        } finally {
            setLoading(false);
        }
    };

    // Monitor auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log('🔄 Auth state changed:', currentUser?.email || 'null');

            if (currentUser) {
                setUser(currentUser);

                // ✅ Ensure JWT token exists when user is logged in
                // This handles page refresh scenarios
                try {
                    await axiosPublic.post('/auth/jwt', { email: currentUser.email });
                    console.log('✅ JWT token refreshed on auth state change');
                } catch (error) {
                    console.error('❌ Failed to refresh JWT:', error);
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        registerUser,
        loginUser,
        googleLogin,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;