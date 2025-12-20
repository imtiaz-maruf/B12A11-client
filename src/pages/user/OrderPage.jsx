// ===========================================
// CLIENT/src/pages/user/OrderPage.jsx
// ===========================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTitle from '../../hooks/useTitle';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Loading from '../../components/shared/Loading';

const OrderPage = () => {
    useTitle('Place Order');
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, userRole } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            quantity: 1
        }
    });

    const quantity = watch('quantity', 1);

    useEffect(() => {
        fetchMeal();
    }, [id]);

    const fetchMeal = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/meals/${id}`
            );
            setMeal(response.data);
        } catch (error) {
            console.error('Error fetching meal:', error);
            toast.error('Failed to load meal details');
            navigate('/meals');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        const totalPrice = meal.price * data.quantity;

        // Show confirmation
        const result = await Swal.fire({
            title: 'Confirm Order',
            html: `
        <div class="text-left">
          <p class="mb-2"><strong>Meal:</strong> ${meal.foodName}</p>
          <p class="mb-2"><strong>Quantity:</strong> ${data.quantity}</p>
          <p class="mb-2"><strong>Price per item:</strong> $${meal.price}</p>
          <p class="mb-2"><strong>Total Price:</strong> $${totalPrice}</p>
        </div>
      `,
            text: `Your total price is $${totalPrice}. Do you want to confirm the order?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Place Order',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const orderData = {
                    foodId: meal._id,
                    mealName: meal.foodName,
                    price: meal.price,
                    quantity: parseInt(data.quantity),
                    chefId: meal.chefId,
                    userEmail: user.email,
                    userAddress: data.userAddress,
                    orderStatus: 'pending',
                    paymentStatus: 'Pending',
                    orderTime: new Date()
                };

                await axiosSecure.post('/api/orders', orderData);

                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed Successfully!',
                    text: 'Your order has been placed. The chef will process it soon.',
                    confirmButtonColor: '#22c55e'
                });

                navigate('/dashboard/my-orders');
            } catch (error) {
                console.error('Error placing order:', error);
                toast.error('Failed to place order');
            }
        }
    };

    if (loading) return <Loading />;

    if (!meal) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Meal not found</p>
            </div>
        );
    }

    const totalPrice = meal.price * quantity;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-8"
                >
                    <h1 className="text-3xl font-bold mb-8 font-heading text-center">
                        Place Your Order
                    </h1>

                    {/* Meal Summary */}
                    <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex gap-4">
                            <img
                                src={meal.foodImage}
                                alt={meal.foodName}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-2">{meal.foodName}</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    by {meal.chefName}
                                </p>
                                <p className="text-primary-600 font-bold text-lg mt-2">
                                    ${meal.price} per item
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Meal Name (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Meal Name
                            </label>
                            <input
                                type="text"
                                value={meal.foodName}
                                disabled
                                className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                            />
                        </div>

                        {/* Price (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Price (per item)
                            </label>
                            <input
                                type="text"
                                value={`$${meal.price}`}
                                disabled
                                className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                {...register('quantity', {
                                    required: 'Quantity is required',
                                    min: { value: 1, message: 'Minimum quantity is 1' },
                                    max: { value: 10, message: 'Maximum quantity is 10' }
                                })}
                                className="input-field"
                            />
                            {errors.quantity && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.quantity.message}
                                </p>
                            )}
                        </div>

                        {/* Chef ID (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Chef ID
                            </label>
                            <input
                                type="text"
                                value={meal.chefId}
                                disabled
                                className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                            />
                        </div>

                        {/* User Email (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Your Email
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                            />
                        </div>

                        {/* Delivery Address */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Delivery Address *
                            </label>
                            <textarea
                                {...register('userAddress', {
                                    required: 'Delivery address is required',
                                    minLength: {
                                        value: 10,
                                        message: 'Address must be at least 10 characters'
                                    }
                                })}
                                className="input-field min-h-[100px]"
                                placeholder="Enter your complete delivery address"
                            />
                            {errors.userAddress && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.userAddress.message}
                                </p>
                            )}
                        </div>

                        {/* Total Price Display */}
                        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total Price:</span>
                                <span className="text-2xl font-bold text-primary-600">
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full btn-primary text-lg">
                            Confirm Order
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderPage;