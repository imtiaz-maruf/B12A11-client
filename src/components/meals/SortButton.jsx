// ===========================================
// CLIENT/src/components/meals/SortButton.jsx
// ===========================================
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const SortButton = ({ sortOrder, onSortChange }) => {
    return (
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by Price:
            </label>
            <button
                onClick={() => onSortChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                {sortOrder === 'asc' ? (
                    <>
                        <FiArrowUp className="w-4 h-4" />
                        <span>Low to High</span>
                    </>
                ) : (
                    <>
                        <FiArrowDown className="w-4 h-4" />
                        <span>High to Low</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default SortButton;