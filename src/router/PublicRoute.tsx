import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function PublicRoute() {
    const token = Cookies.get('token');

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}