// ===========================================
// CLIENT/src/pages/user/MyReviews.jsx
// ===========================================
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiStar, FiEdit, FiTrash2 } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyReviews = () => {
    useTitle('My Reviews');
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axiosSecure.get(`/api/reviews/user/${user.email}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        const result = await Swal.fire({
            title: 'Delete Review?',
            text: 'This action cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Delete'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/api/reviews/${reviewId}`);
                toast.success('Review deleted successfully');
                fetchReviews();
            } catch (error) {
                console.error('Error deleting review:', error);
                toast.error('Failed to delete review');
            }
        }
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setValue('rating', review.rating);
        setValue('comment', review.comment);
    };

    const onSubmitUpdate = async (data) => {
        try {
            await axiosSecure.patch(`/api/reviews/${editingReview._id}`, {
                rating: parseInt(data.rating),
                comment: data.comment
            });

            toast.success('Review updated successfully');
            setEditingReview(null);
            reset();
            fetchReviews();
        } catch (error) {
            console.error('Error updating review:', error);
            toast.error('Failed to update review');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Loading reviews...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className="text-3xl font-bold mb-8 font-heading">My Reviews</h1>

            {reviews.length === 0 ? (
                <div className="card p-12 text-center">
                    <FiStar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No reviews yet</p>
                    <p className="text-gray-400 mt-2">
                        Order meals and share your experience!
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="card p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">
                                        {review.foodId?.foodName || 'Meal'}
                                    </h3>
                                    <div className="flex items-center gap-1 mb-2">
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
                                    <p className="text-sm text-gray-500">
                                        {new Date(review.date).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(review)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        title="Edit Review"
                                    >
                                        <FiEdit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete Review"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingReview && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full"
                    >
                        <h2 className="text-2xl font-bold mb-6">Edit Review</h2>

                        <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-4">
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
                                />
                                {errors.comment && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.comment.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 btn-primary">
                                    Update Review
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingReview(null);
                                        reset();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default MyReviews;