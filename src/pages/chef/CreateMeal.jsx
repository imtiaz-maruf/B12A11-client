// ===========================================
// CLIENT/src/pages/chef/CreateMeal.jsx
// ===========================================
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import { uploadImage } from '../../utils/uploadImage';
import toast from 'react-hot-toast';

const CreateMeal = () => {
    useTitle('Create Meal');
    const { user, userRole } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    // Check if user is a fraud chef
    if (userRole?.status === 'fraud') {
        return (
            <div className="card p-12 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Account Restricted
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Your account has been restricted from creating meals.
                </p>
            </div>
        );
    }

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

    const onSubmit = async (data) => {
        if (!imageFile) {
            toast.error('Please upload an image');
            return;
        }

        if (!userRole?.chefId) {
            toast.error('Chef ID not found. Please contact admin.');
            return;
        }

        setUploading(true);

        try {
            // Upload image to Cloudinary
            const imageUrl = await uploadImage(imageFile);

            // Prepare meal data
            const mealData = {
                foodName: data.foodName,
                chefName: data.chefName,
                foodImage: imageUrl,
                price: parseFloat(data.price),
                rating: 0,
                ingredients: data.ingredients.split(',').map(i => i.trim()),
                deliveryArea: data.deliveryArea,
                estimatedDeliveryTime: data.estimatedDeliveryTime,
                chefExperience: data.chefExperience,
                chefId: userRole.chefId,
                userEmail: user.email,
                createdAt: new Date()
            };

            await axiosSecure.post('/api/meals', mealData);

            toast.success('Meal created successfully!');
            navigate('/dashboard/my-meals');
        } catch (error) {
            console.error('Error creating meal:', error);
            toast.error('Failed to create meal');
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className="text-3xl font-bold mb-8 font-heading">Create New Meal</h1>

            <div className="card p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Food Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Food Name *
                        </label>
                        <input
                            type="text"
                            {...register('foodName', { required: 'Food name is required' })}
                            className="input-field"
                            placeholder="e.g., Chicken Biryani"
                        />
                        {errors.foodName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.foodName.message}
                            </p>
                        )}
                    </div>

                    {/* Chef Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Chef Name *
                        </label>
                        <input
                            type="text"
                            {...register('chefName', { required: 'Chef name is required' })}
                            className="input-field"
                            defaultValue={user.displayName}
                        />
                        {errors.chefName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.chefName.message}
                            </p>
                        )}
                    </div>

                    {/* Food Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Food Image *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                            {imagePreview ? (
                                <div className="space-y-4">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg mx-auto"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <FiUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <label className="cursor-pointer">
                                        <span className="btn-primary inline-block">
                                            Choose Image
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-sm text-gray-500 mt-2">
                                        PNG, JPG, JPEG up to 5MB
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Price ($) *</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('price', {
                                required: 'Price is required',
                                min: { value: 0.01, message: 'Price must be greater than 0' }
                            })}
                            className="input-field"
                            placeholder="0.00"
                        />
                        {errors.price && (
                            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                        )}
                    </div>

                    {/* Ingredients */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Ingredients (comma separated) *
                        </label>
                        <textarea
                            {...register('ingredients', {
                                required: 'Ingredients are required'
                            })}
                            className="input-field min-h-[100px]"
                            placeholder="e.g., Rice, Chicken, Onions, Spices"
                        />
                        {errors.ingredients && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.ingredients.message}
                            </p>
                        )}
                    </div>

                    {/* Delivery Area */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Delivery Area *
                        </label>
                        <input
                            type="text"
                            {...register('deliveryArea', {
                                required: 'Delivery area is required'
                            })}
                            className="input-field"
                            placeholder="e.g., Downtown, City Center"
                        />
                        {errors.deliveryArea && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.deliveryArea.message}
                            </p>
                        )}
                    </div>

                    {/* Estimated Delivery Time */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Estimated Delivery Time *
                        </label>
                        <input
                            type="text"
                            {...register('estimatedDeliveryTime', {
                                required: 'Estimated delivery time is required'
                            })}
                            className="input-field"
                            placeholder="e.g., 30-45 minutes"
                        />
                        {errors.estimatedDeliveryTime && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.estimatedDeliveryTime.message}
                            </p>
                        )}
                    </div>

                    {/* Chef Experience */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Your Cooking Experience *
                        </label>
                        <textarea
                            {...register('chefExperience', {
                                required: 'Chef experience is required'
                            })}
                            className="input-field min-h-[100px]"
                            placeholder="Tell customers about your cooking background and expertise"
                        />
                        {errors.chefExperience && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.chefExperience.message}
                            </p>
                        )}
                    </div>

                    {/* Chef ID (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Chef ID</label>
                        <input
                            type="text"
                            value={userRole?.chefId || 'Not assigned'}
                            disabled
                            className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                        />
                    </div>

                    {/* User Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Creating Meal...' : 'Create Meal'}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default CreateMeal;