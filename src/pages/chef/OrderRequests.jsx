// ===========================================
// CLIENT/src/pages/chef/OrderRequests.jsx
// ===========================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import toast from 'react-hot-toast';

const OrderRequests = () => {
    useTitle('Order Requests');
    const { userRole } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userRole?.chefId) {
            fetchOrders();
        }
    }, [userRole]);

    const fetchOrders = async () => {
        try {
            const response = await axiosSecure.get(
                `/api/orders/chef/${userRole.chefId}`
            );
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axiosSecure.patch(`/api/orders/${orderId}/status`, {
                orderStatus: newStatus
            });

            toast.success(`Order ${newStatus} successfully`);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
            case 'accepted':
                return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
            case 'delivered':
                return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
            case 'cancelled':
                return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
        }
    };

    const isButtonDisabled = (order, action) => {
        if (order.orderStatus === 'cancelled' || order.orderStatus === 'delivered') {
            return true;
        }

        if (action === 'cancel') {
            return order.orderStatus !== 'pending';
        }

        if (action === 'accept') {
            return order.orderStatus !== 'pending';
        }

        if (action === 'deliver') {
            return order.orderStatus !== 'accepted';
        }

        return false;
    };

    if (!userRole?.chefId) {
        return (
            <div className="card p-12 text-center">
                <p className="text-xl text-gray-500">Chef ID not found</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className="text-3xl font-bold mb-8 font-heading">Order Requests</h1>

            {orders.length === 0 ? (
                <div className="card p-12 text-center">
                    <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No order requests yet</p>
                    <p className="text-gray-400 mt-2">
                        Orders will appear here when customers place them
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="card p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">
                                                {order.mealName}
                                            </h3>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary-600">
                                                ${(order.price * order.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {order.quantity} item(s)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Customer Email
                                            </p>
                                            <p className="font-medium">{order.userEmail}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Order Time
                                            </p>
                                            <p className="font-medium">
                                                {new Date(order.orderTime).toLocaleString()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Payment Status
                                            </p>
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid'
                                                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                                                    }`}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Unit Price
                                            </p>
                                            <p className="font-medium">${order.price}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Delivery Address
                                        </p>
                                        <p className="font-medium">{order.userAddress}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                            disabled={isButtonDisabled(order, 'cancel')}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiXCircle className="w-4 h-4" />
                                            Cancel
                                        </button>

                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'accepted')}
                                            disabled={isButtonDisabled(order, 'accept')}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiCheckCircle className="w-4 h-4" />
                                            Accept
                                        </button>

                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'delivered')}
                                            disabled={isButtonDisabled(order, 'deliver')}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiTruck className="w-4 h-4" />
                                            Deliver
                                        </button>
                                    </div>

                                    {order.orderStatus === 'cancelled' && (
                                        <p className="text-sm text-red-600 dark:text-red-400 mt-3">
                                            This order has been cancelled
                                        </p>
                                    )}

                                    {order.orderStatus === 'delivered' && (
                                        <p className="text-sm text-green-600 dark:text-green-400 mt-3">
                                            This order has been delivered
                                        </p>
                                    )}

                                    {order.orderStatus === 'accepted' && (
                                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-3">
                                            Click "Deliver" once the order is delivered to the customer
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default OrderRequests;