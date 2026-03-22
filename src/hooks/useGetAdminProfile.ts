import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
const API_URL = import.meta.env.VITE_API_URL;

export interface AdminProfile {
    id: string;
    email: string;
    role: string;
    createdAt: string;
}

export const useGetAdminProfile = () => {
    return useQuery({
        queryKey: ['admin-profile'],
        queryFn: async () => {
            const token = Cookies.get('token');
            const res = await fetch(`${API_URL}/profile/admin`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch profile');
            return res.json() as Promise<AdminProfile>;
        },
        staleTime: 1000 * 60 * 10, // 10 min cache
    });
};