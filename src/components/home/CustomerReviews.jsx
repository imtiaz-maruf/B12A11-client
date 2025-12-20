// ===========================================
// CLIENT/src/components/home/CustomerReviews.jsx
// ===========================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import axios from 'axios';

const CustomerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Fetch latest 6 reviews from all meals
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/reviews/latest`
                );
                setReviews(response.data.slice(0, 6));
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold font-heading">Customer Reviews</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="card p-6 animate-pulse">
                                <div className="bg-gray-300 dark:bg-gray-700 h-20 rounded mb-4" />
                                <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2" />
                                <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4 font-heading">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Read authentic reviews from food lovers who have experienced our
                        home-cooked meals
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="card p-6"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={review.reviewerImage || 'https://via.placeholder.com/50'}
                                    alt={review.reviewerName}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-semibold">{review.reviewerName}</h4>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                                {review.comment}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                                {new Date(review.date).toLocaleDateString()}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomerReviews;
