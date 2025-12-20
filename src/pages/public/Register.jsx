// ===========================================
// CLIENT/src/pages/public/Register.jsx
// ===========================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiMapPin, FiImage, FiEye, FiEyeOff } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useTitle from '../../hooks/useTitle';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
    useTitle('Register');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            // Create user in Firebase
            await createUser(data.email, data.password);

            // Update profile
            await updateUserProfile(data.name, data.photoURL);

            // Save user to database
            const userData = {
                email: data.email,
                name: data.name,
                photoURL: data.photoURL,
                address: data.address,
                role: 'user',
                status: 'active'
            };

            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users`,
                userData
            );

            toast.success('Registration successful!');
            navigate('/');
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.message || 'Failed to register');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                            Create Account
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Join LocalChefBazaar today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    {...register('name', { required: 'Name is required' })}
                                    className="input-field pl-10"
                                    placeholder="Enter your name"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    className="input-field pl-10"
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Photo URL */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Profile Image URL</label>
                            <div className="relative">
                                <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="url"
                                    {...register('photoURL', { required: 'Photo URL is required' })}
                                    className="input-field pl-10"
                                    placeholder="Enter image URL"
                                />
                            </div>
                            {errors.photoURL && (
                                <p className="text-red-500 text-sm mt-1">{errors.photoURL.message}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <div className="relative">
                                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    {...register('address', { required: 'Address is required' })}
                                    className="input-field pl-10"
                                    placeholder="Enter your address"
                                />
                            </div>
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value =>
                                            value === password || 'Passwords do not match'
                                    })}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full btn-primary">
                            Register
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Login here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;