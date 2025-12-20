// ===========================================
// CLIENT/src/pages/public/Meals.jsx - COMPLETE VERSION
// ===========================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import useTitle from '../../hooks/useTitle';
import MealCard from '../../components/meals/MealCard';
import Pagination from '../../components/meals/Pagination';

const Meals = () => {
    useTitle('All Meals');
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchMeals();
    }, [currentPage, sortOrder]);

    const fetchMeals = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/meals`,
                {
                    params: {
                        page: currentPage,
                        limit: 10,
                        sort: 'price',
                        order: sortOrder
                    }
                }
            );
            setMeals(response.data.meals);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching meals:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold mb-4 font-heading">
                        Browse All Meals
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Discover delicious home-cooked meals from talented local chefs
                    </p>
                </motion.div>

                {/* Sort Controls */}
                <div className="flex justify-end mb-6">
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                    >
                        <option value="desc">Price: High to Low</option>
                        <option value="asc">Price: Low to High</option>
                    </select>
                </div>

                {/* Meals Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="card p-4 animate-pulse">
                                <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4" />
                                <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2" />
                                <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {meals.map((meal) => (
                                <MealCard key={meal._id} meal={meal} />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Meals;