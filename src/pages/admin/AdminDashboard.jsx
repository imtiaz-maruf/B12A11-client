// ===========================================
// CLIENT/src/pages/admin/AdminDashboard.jsx
// ===========================================
// Note: This is actually the same as UserDashboard.jsx
// They share the same component but render different links based on role
// You can create this as an alias or just use UserDashboard directly

import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../../components/dashboard/Sidebar';
import useTitle from '../../hooks/useTitle';

const AdminDashboard = () => {
    useTitle('Admin Dashboard');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <Sidebar />
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-3"
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;