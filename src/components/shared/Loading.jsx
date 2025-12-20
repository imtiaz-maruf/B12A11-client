// ===========================================
// CLIENT/src/components/shared/Loading.jsx
// ===========================================
import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <motion.div
                    className="w-20 h-20 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <motion.h2
                    className="text-2xl font-semibold text-gray-700 dark:text-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Loading...
                </motion.h2>
                <motion.p
                    className="mt-2 text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Please wait while we prepare your experience
                </motion.p>
            </div>
        </div>
    );
};

export default Loading;