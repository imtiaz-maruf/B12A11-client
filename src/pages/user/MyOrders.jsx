// ===========================================
// CLIENT/src/pages/user/MyOrders.jsx
// ===========================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiDollarSign, FiPackage } from 'react-icons/fi';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import toast from 'react-hot-toast';
import CheckoutForm from '../../components/payment/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const MyOrders = () => {
    useTitle('My Orders');
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axiosSecure.get(`/api/orders/user/${user.email}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
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

    const getPaymentStatusColor = (status) => {
        return status === 'paid'
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
    };

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
            <h1 className="text-3xl font-bold mb-8 font-heading">My Orders</h1>

            {orders.length === 0 ? (
                <div className="card p-12 text-center">
                    <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No orders yet</p>
                    <p className="text-gray-400 mt-2">
                        Start ordering delicious meals from our chefs!
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="card p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {order.foodId?.foodImage && (
                                    <img
                                        src={order.foodId.foodImage}
                                        alt={order.mealName}
                                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                                    />
                                )}

                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2">
                                        {order.mealName}
                                    </h3>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Chef
                                            </p>
                                            <p className="font-medium">{order.chefId}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Quantity
                                            </p>
                                            <p className="font-medium">{order.quantity}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Total Price
                                            </p>
                                            <p className="font-medium text-primary-600">
                                                ${(order.price * order.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Order Status
                                            </p>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Payment Status
                                            </p>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getPaymentStatusColor(
                                                    order.paymentStatus
                                                )}`}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Order Time
                                            </p>
                                            <p className="font-medium text-sm">
                                                {new Date(order.orderTime).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Delivery Address
                                        </p>
                                        <p className="text-sm">{order.userAddress}</p>
                                    </div>

                                    {/* Show Pay Button if order is accepted and payment is pending */}
                                    {order.orderStatus === 'accepted' &&
                                        order.paymentStatus === 'Pending' && (
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="btn-primary"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
                        <p className="mb-4">
                            Amount: ${(selectedOrder.price * selectedOrder.quantity).toFixed(2)}
                        </p>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                amount={selectedOrder.price * selectedOrder.quantity}
                                orderId={selectedOrder._id}
                                onSuccess={() => {
                                    setSelectedOrder(null);
                                    fetchOrders();
                                }}
                                onCancel={() => setSelectedOrder(null)}
                            />
                        </Elements>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default MyOrders;