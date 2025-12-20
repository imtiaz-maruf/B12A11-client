// ===========================================
// CLIENT/src/pages/admin/PlatformStatistics.jsx
// ===========================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { FiUsers, FiDollarSign, FiPackage, FiCheckCircle } from 'react-icons/fi';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import toast from 'react-hot-toast';

const PlatformStatistics = () => {
    useTitle('Platform Statistics');
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await axiosSecure.get('/api/statistics');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            toast.error('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Loading statistics...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="card p-12 text-center">
                <p className="text-xl text-gray-500">No statistics available</p>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: FiUsers,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalPaymentAmount.toFixed(2)}`,
            icon: FiDollarSign,
            color: 'bg-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            title: 'Pending Orders',
            value: stats.ordersPending,
            icon: FiPackage,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
        },
        {
            title: 'Delivered Orders',
            value: stats.ordersDelivered,
            icon: FiCheckCircle,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        }
    ];

    const orderData = [
        { name: 'Pending', value: stats.ordersPending },
        { name: 'Delivered', value: stats.ordersDelivered }
    ];

    const barChartData = [
        {
            name: 'Platform',
            Users: stats.totalUsers,
            'Pending Orders': stats.ordersPending,
            'Delivered Orders': stats.ordersDelivered
        }
    ];

    const COLORS = ['#eab308', '#22c55e'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className="text-3xl font-bold mb-8 font-heading">
                Platform Statistics
            </h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`card p-6 ${stat.bgColor}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </div>
                            <div className={`p-4 ${stat.color} text-white rounded-full`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold mb-6">Overview</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Users" fill="#3b82f6" />
                            <Bar dataKey="Pending Orders" fill="#eab308" />
                            <Bar dataKey="Delivered Orders" fill="#22c55e" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold mb-6">Order Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={orderData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {orderData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PlatformStatistics;