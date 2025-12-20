// ===========================================
// CLIENT/src/pages/public/MealDetails.jsx
// ===========================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiClock, FiDollarSign, FiHeart } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Loading from '../../components/shared/Loading';

const MealDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, userRole } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [meal, setMeal] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useTitle(meal ? meal.foodName : 'Meal Details');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        fetchMealDetails();
        fetchReviews();
        if (user) {
            checkIfFavorite();
        }
    }, [id, user]);

    const fetchMealDetails = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/meals/${id}`
            );
            setMeal(response.data);
        } catch (error) {
            console.error('Error fetching meal:', error);
            toast.error('Failed to load meal details');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/reviews/meal/${id}`
            );
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const checkIfFavorite = async () => {
        try {
            const response = await axiosSecure.get(
                `/api/favorites/${user.email}`
            );
            const favorited = response.data.some(fav => fav.mealId._id === id);
            setIsFavorite(favorited);
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
    };

    const handleAddToFavorite = async () => {
        if (!user) {
            toast.error('Please login to add favorites');
            navigate('/login');
            return;
        }

        if (isFavorite) {
            toast.info('Already in favorites');
            return;
        }

        try {
            await axiosSecure.post('/api/favorites', {
                userEmail: user.email,
                mealId: meal._id,
                mealName: meal.foodName,
                chefId: meal.chefId,
                chefName: meal.chefName,
                price: meal.price,
                addedTime: new Date()
            });

            setIsFavorite(true);
            toast.success('Added to favorites!');
        } catch (error) {
            console.error('Error adding to favorites:', error);
            toast.error(error.response?.data?.message || 'Failed to add to favorites');
        }
    };

    const onSubmitReview = async (data) => {
        if (!user) {
            toast.error('Please login to submit a review');
            navigate('/login');
            return;
        }

        try {
            const reviewData = {
                foodId: meal._id,
                reviewerName: user.displayName,
                reviewerEmail: user.email,
                reviewerImage: user.photoURL,
                rating: parseInt(data.rating),
                comment: data.comment,
                date: new Date()
            };

            await axiosSecure.post('/api/reviews', reviewData);

            toast.success('Review submitted successfully!');
            reset();
            fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        }
    };

    const handleOrderNow = () => {
        // Check if user is fraud
        if (userRole?.status === 'fraud') {
            Swal.fire({
                icon: 'error',
                title: 'Account Restricted',
                text: 'Your account has been restricted from placing orders.',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        navigate(`/order/${meal._id}`);
    };

    if (loading) return <Loading />;

    if (!meal) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Meal not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-2 gap-8 mb-12"
                >
                    {/* Image Section */}
                    <div className="relative">
                        <img
                            src={meal.foodImage}
                            alt={meal.foodName}
                            className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                        />
                        <div className="absolute top-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                            <FiStar className="w-5 h-5 fill-white" />
                            <span className="font-bold">{meal.rating || 'New'}</span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="card p-8">
                        <h1 className="text-4xl font-bold mb-4 font-heading">
                            {meal.foodName}
                        </h1>

                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
                            <span>by</span>
                            <span className="font-semibold text-primary-600">
                                {meal.chefName}
                            </span>
                            <span className="text-sm">({meal.chefId})</span>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 text-lg">
                                <FiDollarSign className="w-6 h-6 text-primary-600" />
                                <span className="font-bold text-2xl text-primary-600">
                                    ${meal.price}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <FiMapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <span>{meal.deliveryArea || 'Multiple delivery areas'}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <FiClock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <span>{meal.estimatedDeliveryTime}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                            <div className="flex flex-wrap gap-2">
                                {meal.ingredients?.map((ingredient, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                                    >
                                        {ingredient}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Chef's Experience</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {meal.chefExperience}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleOrderNow}
                                className="flex-1 btn-primary"
                            >
                                Order Now
                            </button>
                            <button
                                onClick={handleAddToFavorite}
                                className={`px-6 py-3 rounded-lg border-2 transition-colors ${isFavorite
                                        ? 'bg-primary-600 border-primary-600 text-white'
                                        : 'border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <FiHeart className={`w-6 h-6 ${isFavorite ? 'fill-white' : ''}`} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Reviews Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-8"
                >
                    <h2 className="text-3xl font-bold mb-6 font-heading">
                        Customer Reviews
                    </h2>

                    {/* Add Review Form */}
                    <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                        <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Rating</label>
                                <select
                                    {...register('rating', { required: 'Rating is required' })}
                                    className="input-field"
                                >
                                    <option value="">Select rating</option>
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Good</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="1">1 - Poor</option>
                                </select>
                                {errors.rating && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.rating.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Comment</label>
                                <textarea
                                    {...register('comment', {
                                        required: 'Comment is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Comment must be at least 10 characters'
                                        }
                                    })}
                                    className="input-field min-h-[100px]"
                                    placeholder="Share your experience..."
                                />
                                {errors.comment && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.comment.message}
                                    </p>
                                )}
                            </div>

                            <button type="submit" className="btn-primary">
                                Submit Review
                            </button>
                        </form>
                    </div>

                    {/* Display Reviews */}
                    <div className="space-y-6">
                        {reviews.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                No reviews yet. Be the first to review!
                            </p>
                        ) : (
                            reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={review.reviewerImage || 'https://via.placeholder.com/50'}
                                            alt={review.reviewerName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold">{review.reviewerName}</h4>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(review.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-3">
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
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MealDetails;