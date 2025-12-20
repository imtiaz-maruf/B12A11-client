// ===========================================
// CLIENT/src/pages/admin/ManageUsers.jsx
// ===========================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiShield, FiAlertCircle } from 'react-icons/fi';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    useTitle('Manage Users');
    const axiosSecure = useAxiosSecure();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosSecure.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleMakeFraud = async (userId, userName) => {
        const result = await Swal.fire({
            title: 'Mark as Fraud?',
            html: `Are you sure you want to mark <strong>${userName}</strong> as fraud?<br><br>This will restrict their account access.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Mark as Fraud'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/api/users/${userId}/status`, {
                    status: 'fraud'
                });

                toast.success('User marked as fraud successfully');
                fetchUsers();
            } catch (error) {
                console.error('Error updating user status:', error);
                toast.error('Failed to update user status');
            }
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
            case 'chef':
                return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
        }
    };

    const getStatusBadgeColor = (status) => {
        return status === 'active'
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-heading">Manage Users</h1>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FiUsers className="w-5 h-5" />
                    <span>{users.length} Total Users</span>
                </div>
            </div>

            <div className="card overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                User Info
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Role
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Chef ID
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.photoURL || 'https://via.placeholder.com/40'}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm">{user.email}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(
                                            user.role
                                        )}`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(
                                            user.status
                                        )}`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-mono">
                                        {user.chefId || '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {user.role !== 'admin' && user.status !== 'fraud' ? (
                                        <button
                                            onClick={() => handleMakeFraud(user._id, user.name)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                        >
                                            <FiAlertCircle className="w-4 h-4" />
                                            Make Fraud
                                        </button>
                                    ) : user.status === 'fraud' ? (
                                        <span className="text-sm text-red-600 dark:text-red-400">
                                            Marked as Fraud
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            <FiShield className="inline w-4 h-4 mr-1" />
                                            Admin
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ManageUsers;