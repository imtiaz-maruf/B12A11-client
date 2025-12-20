// CLIENT/src/components/home/DailyMeals.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import MealCard from '../meals/MealCard';

const DailyMeals = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/meals?limit=6`
                );
                setMeals(response.data.meals);
            } catch (error) {
                console.error('Error fetching meals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="card p-4 animate-pulse">
                            <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4" />
                            <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2" />
                            <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4 font-heading">
                        Today's Special Meals
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore our curated selection of delicious home-cooked meals
                        prepared by talented local chefs.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {meals.map((meal, index) => (
                        <motion.div
                            key={meal._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <MealCard meal={meal} />
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/meals"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                    >
                        View All Meals
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DailyMeals;
