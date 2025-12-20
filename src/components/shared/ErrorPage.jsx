// ===========================================
// CLIENT/src/components/shared/ErrorPage.jsx
// ===========================================
import { Link, useRouteError } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiAlertCircle } from 'react-icons/fi';
import useTitle from '../../hooks/useTitle';

const ErrorPage = () => {
    useTitle('404 - Page Not Found');
    const error = useRouteError();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
            <motion.div
                className="text-center px-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="mb-8"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                    <FiAlertCircle className="w-32 h-32 mx-auto text-primary-500" />
                </motion.div>

                <motion.h1
                    className="mb-4 text-9xl font-bold text-primary-600 dark:text-primary-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                    404
                </motion.h1>

                <motion.h2
                    className="mb-4 text-4xl font-bold text-gray-800 dark:text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Oops! Page Not Found
                </motion.h2>

                <motion.p
                    className="mb-8 text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    {error?.statusText || error?.message ||
                        "The page you're looking for seems to have gone on a cooking break. Let's get you back to the kitchen!"}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                        <FiHome className="w-5 h-5" />
                        Back to Home
                    </Link>
                </motion.div>

                <motion.div
                    className="mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Error Code: {error?.status || '404'}
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ErrorPage;