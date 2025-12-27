// ============================================================================
// CRITICAL FIX 6: Test Component to Verify Setup
// CLIENT/src/components/DebugAuth.jsx - CREATE THIS FILE
// ============================================================================

import { useState } from 'react';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { axiosPublic } from '../hooks/useAxiosPublic';

const DebugAuth = () => {
    const [results, setResults] = useState({});
    const axiosSecure = useAxiosSecure();

    const tests = {
        '1. Check Browser Cookies': () => {
            const cookies = document.cookie.split(';').map(c => c.trim());
            setResults(prev => ({
                ...prev,
                browserCookies: cookies.length > 0 ? cookies : 'No cookies found'
            }));
        },

        '2. Test Backend Cookie Reading': async () => {
            try {
                const res = await axiosPublic.get('/auth/debug-cookies');
                setResults(prev => ({
                    ...prev,
                    backendCookies: res.data
                }));
            } catch (err) {
                setResults(prev => ({
                    ...prev,
                    backendCookies: 'Error: ' + err.message
                }));
            }
        },

        '3. Test Protected Route': async () => {
            try {
                const res = await axiosSecure.get('/orders/my-orders');
                setResults(prev => ({
                    ...prev,
                    protectedRoute: 'Success! Orders loaded'
                }));
            } catch (err) {
                setResults(prev => ({
                    ...prev,
                    protectedRoute: `Error ${err.response?.status}: ${err.response?.data?.message}`
                }));
            }
        },

        '4. Test Token Verification': async () => {
            try {
                const res = await axiosPublic.get('/auth/verify');
                setResults(prev => ({
                    ...prev,
                    tokenVerify: res.data
                }));
            } catch (err) {
                setResults(prev => ({
                    ...prev,
                    tokenVerify: 'Error: ' + err.message
                }));
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Authentication Debugger</h1>

            <div className="space-y-4">
                {Object.entries(tests).map(([name, test]) => (
                    <button
                        key={name}
                        onClick={test}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-left"
                    >
                        {name}
                    </button>
                ))}
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">Results:</h3>
                <pre className="text-xs overflow-auto">
                    {JSON.stringify(results, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default DebugAuth;