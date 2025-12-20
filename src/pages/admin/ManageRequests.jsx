// ===========================================
// CLIENT/src/pages/admin/ManageRequests.jsx
// ===========================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageRequests = () => {
    useTitle('Manage Requests');
    const axiosSecure = useAxiosSecure();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axiosSecure.get('/api/requests');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId, userName, requestType) => {
        const result = await Swal.fire({
            title: 'Approve Request?',
            html: `Approve <strong>${userName}</strong>'s request to become a <strong>${requestType}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#22c55e',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Approve'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/api/requests/${requestId}`, {
                    requestStatus: 'approved'
                });

                toast.success('Request approved successfully');
                fetchRequests();
            } catch (error) {
                console.error('Error approving request:', error);
                toast.error('Failed to approve request');
            }
        }
    };

    const handleReject = async (requestId, userName) => {
        const result = await Swal.fire({
            title: 'Reject Request?',
            html: `Are you sure you want to reject <strong>${userName}</strong>'s request?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Reject'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/api/requests/${requestId}`, {
                    requestStatus: 'rejected'
                });

                toast.success('Request rejected');
                fetchRequests();
            } catch (error) {
                console.error('Error rejecting request:', error);
                toast.error('Failed to reject request');
            }
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
            case 'approved':
                return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
            case 'rejected':
                return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
        }
    };

    const getRequestTypeBadgeColor = (type) => {
        return type === 'chef'
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
            : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Loading requests...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-heading">Manage Requests</h1>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FiClock className="w-5 h-5" />
                    <span>
                        {requests.filter((r) => r.requestStatus === 'pending').length}{' '}
                        Pending
                    </span>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="card p-12 text-center">
                    <FiClock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No requests yet</p>
                </div>
            ) : (
                <div className="card overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    User Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Request Type
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Request Time
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {requests.map((request) => (
                                <tr
                                    key={request._id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-medium">{request.userName}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm">{request.userEmail}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getRequestTypeBadgeColor(
                                                request.requestType
                                            )}`}
                                        >
                                            {request.requestType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(
                                                request.requestStatus
                                            )}`}
                                        >
                                            {request.requestStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">
                                            {new Date(request.requestTime).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {request.requestStatus === 'pending' ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleApprove(
                                                            request._id,
                                                            request.userName,
                                                            request.requestType
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                                >
                                                    <FiCheckCircle className="w-4 h-4" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleReject(request._id, request.userName)
                                                    }
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                                >
                                                    <FiXCircle className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center text-sm text-gray-500">
                                                {request.requestStatus === 'approved'
                                                    ? 'Approved'
                                                    : 'Rejected'}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};

export default ManageRequests;