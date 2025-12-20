// ===========================================
// CLIENT/src/pages/chef/MyMeals.jsx
// ===========================================
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPackage } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import { uploadImage } from '../../utils/uploadImage';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyMeals = () => {
    useTitle('My Meals');
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMeal, setEditingMeal] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            const response = await axiosSecure.get(`/api/meals/chef/${user.email}`);
            setMeals(response.data);
        } catch (error) {
            console.error('Error fetching meals:', error);
            toast.error('Failed to load meals');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (mealId) => {
        const result = await Swal.fire({
            title: 'Delete Meal?',
            text: 'This action cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Delete'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/api/meals/${mealId}`);
                toast.success('Meal deleted successfully');
                fetchMeals();
            } catch (error) {
                console.error('Error deleting meal:', error);
                toast.error('Failed to delete meal');
            }
        }
    };

    const handleEdit = (meal) => {
        setEditingMeal(meal);
        setValue('foodName', meal.foodName);
        setValue('chefName', meal.chefName);
        setValue('price', meal.price);
        setValue('ingredients', meal.ingredients.join(', '));
        setValue('deliveryArea', meal.deliveryArea);
        setValue('estimatedDeliveryTime', meal.estimatedDeliveryTime);
        setValue('chefExperience', meal.chefExperience);
        setImagePreview(meal.foodImage);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmitUpdate = async (data) => {
        try {
            let imageUrl = editingMeal.foodImage;

            // Upload new image if selected
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            const updateData = {
                foodName: data.foodName,
                chefName: data.chefName,
                foodImage: imageUrl,
                price: parseFloat(data.price),
                ingredients: data.ingredients.split(',').map(i => i.trim()),
                deliveryArea: data.deliveryArea,
                estimatedDeliveryTime: data.estimatedDeliveryTime,
                chefExperience: data.chefExperience
            };

            await axiosSecure.patch(`/api/meals/${editingMeal._id}`, updateData);

            toast.success('Meal updated successfully');
            setEditingMeal(null);
            setImageFile(null);
            setImagePreview(null);
            reset();
            fetchMeals();
        } catch (error) {
            console.error('Error updating meal:', error);
            toast.error('Failed to update meal');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Loading meals...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className="text-3xl font-bold mb-8 font-heading">My Meals</h1>

            {meals.length === 0 ? (
                <div className="card p-12 text-center">
                    <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No meals created yet</p>
                    <p className="text-gray-400 mt-2">
                        Start creating delicious meals for your customers!
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {meals.map((meal) => (
                        <div key={meal._id} className="card overflow-hidden">
                            <img
                                src={meal.foodImage}
                                alt={meal.foodName}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{meal.foodName}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    ${meal.price}
                                </p>
                                <p className="text-sm text-gray-500 mb-2">
                                    Rating: {meal.rating || 'New'}
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    {meal.deliveryArea} • {meal.estimatedDeliveryTime}
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(meal)}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FiEdit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(meal._id)}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingMeal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full my-8"
                    >
                        <h2 className="text-2xl font-bold mb-6">Edit Meal</h2>

                        <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            {/* Similar fields as CreateMeal */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Food Name</label>
                                <input
                                    type="text"
                                    {...register('foodName', { required: 'Food name is required' })}
                                    className="input-field"
                                />
                                {errors.foodName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.foodName.message}</p>
                                )}
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Food Image</label>
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('price', { required: 'Price is required' })}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Ingredients</label>
                                <textarea
                                    {...register('ingredients', { required: 'Ingredients are required' })}
                                    className="input-field min-h-[80px]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Delivery Area</label>
                                <input
                                    type="text"
                                    {...register('deliveryArea', { required: 'Delivery area is required' })}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Delivery Time</label>
                                <input
                                    type="text"
                                    {...register('estimatedDeliveryTime', { required: 'Time is required' })}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Experience</label>
                                <textarea
                                    {...register('chefExperience', { required: 'Experience is required' })}
                                    className="input-field min-h-[80px]"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 btn-primary">
                                    Update Meal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingMeal(null);
                                        setImageFile(null);
                                        setImagePreview(null);
                                        reset();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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

export default MyMeals;