import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

interface VerifyTokenResponse {
    id: string
}

const verifyToken = async (): Promise<VerifyTokenResponse> => {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    try {
        const response = await fetch(`${API_URL}/admin/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            Cookies.remove('token');
            throw new Error('Token invalid or expired');
        }

        return response.json();
    } catch (error: any) {

        if (error.message === 'Token invalid or expired') {
            throw error;
        }
        // Server down / network error
        throw new Error('Network error');
    }
};

export const useVerifyToken = () => {
    return useQuery({
        queryKey: ['auth', 'verify'],
        queryFn: verifyToken,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
};