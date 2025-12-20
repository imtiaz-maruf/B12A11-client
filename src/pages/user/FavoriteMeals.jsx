// ===========================================
// CLIENT/src/pages/user/FavoriteMeals.jsx
// ===========================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const FavoriteMeals = () => {
    useTitle('Favorite Meals');
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await axiosSecure.get(`/api/favorites/${user.email}`);
            setFavorites(response.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            toast.error('Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (favoriteId) => {
        const result = await Swal.fire({
            title: 'Remove from Favorites?',
            text: 'This meal will be removed from your favorites',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Remove'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/api/favorites/${favoriteId}`);
                toast.success('Removed from favorites');
                fetchFavorites();
            } catch (error) {
                console.error('Error removing favorite:', error);
                toast.error('Failed to remove favorite');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Loading favorites...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className="text-3xl font-bold mb-8 font-heading">Favorite Meals</h1>

            {favorites.length === 0 ? (
                <div className="card p-12 text-center">
                    <FiHeart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No favorites yet</p>
                    <p className="text-gray-400 mt-2">
                        Start adding meals to your favorites!
                    </p>
                </div>
            ) : (
                <div className="card overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Meal Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Chef Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Date Added
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {favorites.map((favorite) => (
                                <tr
                                    key={favorite._id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {favorite.mealId?.foodImage && (
                                                <img
                                                    src={favorite.mealId.foodImage}
                                                    alt={favorite.mealName}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            )}
                                            <span className="font-medium">{favorite.mealName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span>{favorite.chefName}</span>
                                        <span className="text-sm text-gray-500 ml-2">
                                            ({favorite.chefId})
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-primary-600">
                                            ${favorite.price}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">
                                            {new Date(favorite.addedTime).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDelete(favorite._id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};

export default FavoriteMeals;