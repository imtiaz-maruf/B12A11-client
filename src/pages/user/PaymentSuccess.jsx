// ===========================================
// CLIENT/src/pages/user/PaymentSuccess.jsx
// ===========================================
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import useTitle from '../../hooks/useTitle';

const PaymentSuccess = () => {
    useTitle('Payment Successful');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="card p-12 text-center max-w-md"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mb-6"
                >
                    <FiCheckCircle className="w-24 h-24 mx-auto text-green-500" />
                </motion.div>

                <h1 className="text-3xl font-bold mb-4 font-heading">
                    Payment Successful!
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Your payment has been processed successfully. Your order is now being
                    prepared by the chef.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/dashboard/my-orders"
                        className="block btn-primary"
                    >
                        View My Orders
                        <FiArrowRight className="inline ml-2" />
                    </Link>

                    <Link
                        to="/meals"
                        className="block px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors font-semibold"
                    >
                        Browse More Meals
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;