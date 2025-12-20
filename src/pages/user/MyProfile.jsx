// ===========================================
// CLIENT/src/pages/user/MyProfile.jsx
// ===========================================
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiUser, FiShield } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyProfile = () => {
    useTitle('My Profile');
    const { user, userRole } = useAuth();
    const axiosSecure = useAxiosSecure();

    const handleRoleRequest = async (requestType) => {
        const result = await Swal.fire({
            title: `Request ${requestType === 'chef' ? 'Chef' : 'Admin'} Role?`,
            text: 'Your request will be sent to the admin for approval.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Send Request'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.post('/api/requests', {
                    userName: user.displayName,
                    userEmail: user.email,
                    requestType: requestType,
                    requestStatus: 'pending',
                    requestTime: new Date()
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Request Sent!',
                    text: 'Your request has been sent to the admin. You will be notified once it is reviewed.',
                    confirmButtonColor: '#22c55e'
                });
            } catch (error) {
                console.error('Error sending request:', error);
                if (error.response?.data?.message === 'Request already pending') {
                    toast.error('You already have a pending request');
                } else {
                    toast.error('Failed to send request');
                }
            }
        }
    };

    if (!userRole) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className="text-3xl font-bold mb-8 font-heading">My Profile</h1>

            <div className="card p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                        <img
                            src={userRole.photoURL || 'https://via.placeholder.com/150'}
                            alt={userRole.name}
                            className="w-40 h-40 rounded-full object-cover border-4 border-primary-500"
                        />
                    </div>

                    {/* Profile Details */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                                <FiUser className="w-4 h-4" />
                                Full Name
                            </label>
                            <p className="text-lg font-semibold">{userRole.name}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                                <FiMail className="w-4 h-4" />
                                Email Address
                            </label>
                            <p className="text-lg">{userRole.email}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                                <FiMapPin className="w-4 h-4" />
                                Address
                            </label>
                            <p className="text-lg">{userRole.address || 'Not provided'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    <FiShield className="w-4 h-4" />
                                    Role
                                </label>
                                <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full font-semibold capitalize">
                                    {userRole.role}
                                </span>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Status
                                </label>
                                <span
                                    className={`inline-block px-4 py-2 rounded-full font-semibold capitalize ${userRole.status === 'active'
                                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                        }`}
                                >
                                    {userRole.status}
                                </span>
                            </div>
                        </div>

                        {userRole.chefId && (
                            <div>
                                <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
                                    Chef ID
                                </label>
                                <p className="text-lg font-mono font-semibold text-primary-600">
                                    {userRole.chefId}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Role Request Buttons */}
                {userRole.role !== 'admin' && (
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold mb-4">Request Role Upgrade</h3>
                        <div className="flex gap-4">
                            {userRole.role !== 'chef' && (
                                <button
                                    onClick={() => handleRoleRequest('chef')}
                                    className="btn-primary"
                                >
                                    Become a Chef
                                </button>
                            )}
                            <button
                                onClick={() => handleRoleRequest('admin')}
                                className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-semibold"
                            >
                                Request Admin Role
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Note: Your request will be reviewed by an administrator
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MyProfile;