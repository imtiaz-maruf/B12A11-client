// CLIENT/src/components/meals/MealCard.jsx
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiDollarSign } from 'react-icons/fi';

const MealCard = ({ meal }) => {
    return (
        <div className="card overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={meal.foodImage}
                    alt={meal.foodName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <FiStar className="w-4 h-4" />
                    <span className="font-semibold">{meal.rating || 'New'}</span>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold mb-2 line-clamp-1">{meal.foodName}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                    by {meal.chefName}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <FiMapPin className="w-4 h-4" />
                    <span>{meal.deliveryArea || 'Multiple areas'}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-primary-600 font-bold text-xl">
                        <FiDollarSign />
                        {meal.price}
                    </div>
                    <Link
                        to={`/meal/${meal._id}`}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        See Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MealCard;
