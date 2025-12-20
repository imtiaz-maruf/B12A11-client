// ===========================================
// CLIENT/src/routes/Routes.jsx
// ===========================================
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../components/shared/ErrorPage';
import PrivateRoute from '../components/shared/PrivateRoute';

// Public Pages
import Home from '../pages/public/Home';
import Meals from '../pages/public/Meals';
import MealDetails from '../pages/public/MealDetails';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';

// User Dashboard
import UserDashboard from '../pages/user/UserDashboard';
import MyProfile from '../pages/user/MyProfile';
import MyOrders from '../pages/user/MyOrders';
import MyReviews from '../pages/user/MyReviews';
import FavoriteMeals from '../pages/user/FavoriteMeals';
import OrderPage from '../pages/user/OrderPage';
import PaymentSuccess from '../pages/user/PaymentSuccess';

// Chef Dashboard
import CreateMeal from '../pages/chef/CreateMeal';
import MyMeals from '../pages/chef/MyMeals';
import OrderRequests from '../pages/chef/OrderRequests';

// Admin Dashboard
import ManageUsers from '../pages/admin/ManageUsers';
import ManageRequests from '../pages/admin/ManageRequests';
import PlatformStatistics from '../pages/admin/PlatformStatistics';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/meals',
                element: <Meals />
            },
            {
                path: '/meal/:id',
                element: (
                    <PrivateRoute>
                        <MealDetails />
                    </PrivateRoute>
                )
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/order/:id',
                element: (
                    <PrivateRoute>
                        <OrderPage />
                    </PrivateRoute>
                )
            },
            {
                path: '/payment-success',
                element: (
                    <PrivateRoute>
                        <PaymentSuccess />
                    </PrivateRoute>
                )
            },
            {
                path: '/dashboard',
                element: (
                    <PrivateRoute>
                        <UserDashboard />
                    </PrivateRoute>
                ),
                children: [
                    {
                        path: 'profile',
                        element: <MyProfile />
                    },
                    {
                        path: 'my-orders',
                        element: <MyOrders />
                    },
                    {
                        path: 'my-reviews',
                        element: <MyReviews />
                    },
                    {
                        path: 'favorites',
                        element: <FavoriteMeals />
                    },
                    // Chef Routes
                    {
                        path: 'create-meal',
                        element: <CreateMeal />
                    },
                    {
                        path: 'my-meals',
                        element: <MyMeals />
                    },
                    {
                        path: 'order-requests',
                        element: <OrderRequests />
                    },
                    // Admin Routes
                    {
                        path: 'manage-users',
                        element: <ManageUsers />
                    },
                    {
                        path: 'manage-requests',
                        element: <ManageRequests />
                    },
                    {
                        path: 'statistics',
                        element: <PlatformStatistics />
                    }
                ]
            }
        ]
    }
]);

export default router;