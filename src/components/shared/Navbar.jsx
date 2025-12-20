// ===========================================
// CLIENT/src/components/shared/Navbar.jsx
// ===========================================
import { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import { BiDish } from 'react-icons/bi';
import useAuth from '../../hooks/useAuth';
import { ThemeContext } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logoutUser } = useAuth()
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success('Logged out successfully!');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    const navLinks = (
        <>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors ${isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                }
            >
                Home
            </NavLink>
            <NavLink
                to="/meals"
                className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors ${isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                }
            >
                Meals
            </NavLink>
            {user && (
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-colors ${isActive
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`
                    }
                >
                    Dashboard
                </NavLink>
            )}
        </>
    );

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <BiDish className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        <span className="text-xl font-bold font-heading text-gray-800 dark:text-white">
                            LocalChefBazaar
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {navLinks}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <FiSun className="w-5 h-5" />
                            ) : (
                                <FiMoon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <img
                                        src={user.photoURL || 'https://via.placeholder.com/40'}
                                        alt={user.displayName}
                                        className="w-10 h-10 rounded-full border-2 border-primary-500 cursor-pointer"
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 hidden group-hover:block">
                                        <p className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
                                            {user.displayName}
                                        </p>
                                        <Link
                                            to="/dashboard/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Profile
                                        </Link>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-2">
                                {navLinks}

                                <button
                                    onClick={toggleTheme}
                                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                >
                                    {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                </button>

                                {user ? (
                                    <>
                                        <div className="px-4 py-2">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.photoURL || 'https://via.placeholder.com/40'}
                                                    alt={user.displayName}
                                                    className="w-10 h-10 rounded-full border-2 border-primary-500"
                                                />
                                                <p className="font-semibold">{user.displayName}</p>
                                            </div>
                                        </div>
                                        <Link
                                            to="/dashboard/profile"
                                            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block px-4 py-2 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-center"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;