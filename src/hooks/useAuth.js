// ===========================================
// CLIENT/src/hooks/useAuth.js
// ===========================================
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return auth;
};

export default useAuth;