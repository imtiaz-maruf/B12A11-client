// CLIENT/src/components/home/HeroSection.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const HeroSection = () => {
    return (
        <section className="relative min-h-[600px] bg-gradient-to-br from-primary-500 to-secondary-500 overflow-hidden">
            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">
                            Discover Authentic
                            <br />
                            <span className="text-yellow-300">Home-Cooked Meals</span>
                        </h1>
                        <p className="text-xl text-white/90 mb-8">
                            Connect with talented local chefs and enjoy delicious, homemade
                            meals delivered to your doorstep.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                to="/meals"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-lg"
                            >
                                Browse Meals
                                <FiArrowRight />
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
                            >
                                Become a Chef
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <motion.img
                            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
                            alt="Delicious Food"
                            className="rounded-3xl shadow-2xl"
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Decorative elements */}
            <motion.div
                className="absolute top-20 right-20 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
        </section>
    );
};

export default HeroSection;
