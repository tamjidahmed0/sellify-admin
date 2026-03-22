import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AdminLayout from '../layouts/AdminLayout';
import FullPageLoader from '../components/ui/FullPageLoader';


const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductFormPage = lazy(() => import('../pages/Productformpage'));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('../pages/OrderDetailPage'));
const SlidesPage = lazy(() => import('../pages/SlidesPage'));
const SlideFormPage = lazy(() => import('../pages/SlideFormPage'));
const ReviewsPage = lazy(() => import('../pages/ReviewPage'));

export default function AppRouter() {
    return (
        <Suspense fallback={<FullPageLoader />}>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/add" element={<ProductFormPage />} />
                        <Route path="/products/edit/:id" element={<ProductFormPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/orders/:id" element={<OrderDetailPage />} />
                        <Route path="/slides" element={<SlidesPage />} />
                        <Route path="/slides/add" element={<SlideFormPage />} />
                        <Route path="/slides/edit/:id" element={<SlideFormPage />} />
                        <Route path="/reviews" element={<ReviewsPage />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Suspense>
    );
}
