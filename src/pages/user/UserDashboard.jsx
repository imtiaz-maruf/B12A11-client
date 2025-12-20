// ===========================================
// CLIENT/src/pages/user/UserDashboard.jsx - COMPLETE VERSION
// ===========================================
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiUser,
    FiShoppingBag,
    FiStar,
    FiHeart,
    FiPlusCircle,
    FiList,
    FiUsers,
    FiCheckSquare,
    FiBarChart2
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useTitle from '../../hooks/useTitle';

const UserDashboard = () => {
    useTitle('Dashboard');
    const { userRole } = useAuth();
    const location = useLocation();

    const userLinks = [
        { path: '/dashboard/profile', label: 'My Profile', icon: FiUser },
        { path: '/dashboard/my-orders', label: 'My Orders', icon: FiShoppingBag },
        { path: '/dashboard/my-reviews', label: 'My Reviews', icon: FiStar },
        { path: '/dashboard/favorites', label: 'Favorites', icon: FiHeart }
    ];

    const chefLinks = [
        { path: '/dashboard/profile', label: 'My Profile', icon: FiUser },
        { path: '/dashboard/create-meal', label: 'Create Meal', icon: FiPlusCircle },
        { path: '/dashboard/my-meals', label: 'My Meals', icon: FiList },
        { path: '/dashboard/order-requests', label: 'Order Requests', icon: FiShoppingBag }
    ];

    const adminLinks = [
        { path: '/dashboard/profile', label: 'My Profile', icon: FiUser },
        { path: '/dashboard/manage-users', label: 'Manage Users', icon: FiUsers },
        { path: '/dashboard/manage-requests', label: 'Manage Requests', icon: FiCheckSquare },
        { path: '/dashboard/statistics', label: 'Statistics', icon: FiBarChart2 }
    ];

    const links =
        userRole?.role === 'admin'
            ? adminLinks
            : userRole?.role === 'chef'
                ? chefLinks
                : userLinks;

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
                        <div className="card p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6 font-heading">Dashboard</h2>
                            <nav className="space-y-2">
                                {links.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === link.path
                                                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <link.icon className="w-5 h-5" />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
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

export default UserDashboard;