import { Navigate, Outlet } from 'react-router-dom';
import { useVerifyToken } from '../hooks/useVerifyToken';
import FullPageLoader from '../components/ui/FullPageLoader';

export default function ProtectedRoute() {

  const { data, isLoading, isError, error } = useVerifyToken();

  if (isLoading) return <FullPageLoader />




  if (isError) {
    const isNetworkError = (error as Error)?.message === 'Network error';

    if (isNetworkError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-white font-semibold">Unable to connect to server</p>
            <p className="text-slate-400 text-sm">Please try again later</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    // Token invalid → login
    return <Navigate to="/login" replace />;
  }

  if (!data) return <Navigate to="/login" replace />;

  return <Outlet />;



}