// ===========================================
// CLIENT/src/components/home/ExtraSection.jsx
// ===========================================
import { motion } from 'framer-motion';
import { FiCheckCircle, FiUsers, FiTruck, FiHeart } from 'react-icons/fi';

const ExtraSection = () => {
    const features = [
        {
            icon: FiUsers,
            title: 'Verified Chefs',
            description: 'All our chefs are verified and trained professionals who love cooking'
        },
        {
            icon: FiHeart,
            title: 'Made with Love',
            description: 'Every meal is prepared with care and attention to detail'
        },
        {
            icon: FiTruck,
            title: 'Fast Delivery',
            description: 'Get your meals delivered fresh and hot to your doorstep'
        },
        {
            icon: FiCheckCircle,
            title: 'Quality Guaranteed',
            description: 'We ensure the highest quality ingredients and hygiene standards'
        }
    ];

    const stats = [
        { number: '500+', label: 'Happy Customers' },
        { number: '50+', label: 'Local Chefs' },
        { number: '1000+', label: 'Meals Delivered' },
        { number: '4.8', label: 'Average Rating' }
    ];

    return (
        <>
            {/* How It Works Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4 font-heading">
                            How It Works
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Getting delicious home-cooked meals is simple
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Browse Meals',
                                description: 'Explore our diverse menu of home-cooked meals'
                            },
                            {
                                step: '2',
                                title: 'Place Order',
                                description: 'Select your favorite meal and place an order'
                            },
                            {
                                step: '3',
                                title: 'Chef Prepares',
                                description: 'Our chef prepares your meal fresh with love'
                            },
                            {
                                step: '4',
                                title: 'Enjoy',
                                description: 'Receive your meal and enjoy the delicious taste'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4 font-heading">
                            Why Choose LocalChefBazaar?
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 text-center text-white">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                                <div className="text-xl opacity-90">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ExtraSection;
