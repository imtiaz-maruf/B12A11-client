// ===========================================
// CLIENT/src/pages/public/Home.jsx - COMPLETE VERSION
// ===========================================
import { motion } from 'framer-motion';
import useTitle from '../../hooks/useTitle';
import HeroSection from '../../components/home/HeroSection';
import DailyMeals from '../../components/home/DailyMeals';
import CustomerReviews from '../../components/home/CustomerReviews';
import ExtraSection from '../../components/home/ExtraSection';

// Test if Tailwind is working:
function Test() {
    return (
        <div className="bg-red-500 text-white p-4 m-4 rounded-lg">
            If you see a RED box with white text, Tailwind is working! ✅
        </div>
    );
}

// Add this component to your Home page temporarily
// If you see the red box, Tailwind CSS is working
// If not, follow the troubleshooting steps above


const Home = () => {
    useTitle('Home');

    return (
        <div className="min-h-screen">
            <HeroSection />
            <DailyMeals />
            <CustomerReviews />
            <ExtraSection />
        </div>
    );
};

export default Home;