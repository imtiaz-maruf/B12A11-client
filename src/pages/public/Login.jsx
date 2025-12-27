// ============================================================================
// CRITICAL FIX 2: Check Cookie Immediately After Login
// CLIENT/src/components/Login.jsx
// ============================================================================

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('🔐 Attempting login for:', formData.email);

            // Login (this now handles JWT token internally)
            await loginUser(formData.email, formData.password);

            // ✅ CRITICAL: Verify cookie was set
            const cookies = document.cookie.split(';').map(c => c.trim());
            const tokenCookie = cookies.find(c => c.startsWith('token='));

            console.log('📋 All cookies:', cookies);
            console.log('🍪 Token cookie:', tokenCookie || 'NOT FOUND');

            if (!tokenCookie) {
                console.error('❌ WARNING: No token cookie found after login!');
                toast.error('Login succeeded but token not set. Please try again.');
                return;
            }

            console.log('✅ Login successful with cookie');
            toast.success('Login successful!');

            // Small delay to ensure cookie is ready
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 100);

        } catch (error) {
            console.error('❌ Login error:', error);
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {/* Debug Info (remove in production) */}
            <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
                <p className="font-bold">Debug Info:</p>
                <p>Current cookies: {document.cookie || 'None'}</p>
            </div>
        </div>
    );
};

export default Login;