// ===========================================
// CLIENT/src/context/AuthContext.jsx - FIXED
// ===========================================

import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext(null);

const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // ✅ Required for cookies
    headers: { 'Content-Type': 'application/json' }
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const { data } = await axiosAuth.post('/api/auth/jwt', { email: currentUser.email });
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                    }
                } catch (err) {
                    console.error('JWT Error:', err);
                }
            } else {
                localStorage.removeItem('token');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logoutUser = async () => {
        await axiosAuth.post('/api/auth/logout').catch(() => { });
        localStorage.removeItem('token');
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;