import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
const API_URL = import.meta.env.VITE_API_URL;

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    product: { id: string; name: string; image: string | null };
    user: { name: string; email: string; picture: string | null };
}

export interface ReviewsQuery {
    page?: number;
    limit?: number;
    productId?: string;
    rating?: number | '';
}

export interface ReviewsResponse {
    data: Review[];
    meta: { total: number; page: number; limit: number; totalPages: number };
    stats: {
        total: number;
        average: number;
        distribution: { rating: number; count: number }[];
    };
}

const token = Cookies.get('token')

// ── GET reviews ───────────────────────────────────────────────
export const useGetReviews = (query: ReviewsQuery) => {
    return useQuery({
        queryKey: ['reviews', query],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (query.page) params.set('page', String(query.page));
            if (query.limit) params.set('limit', String(query.limit));
            if (query.productId) params.set('productId', query.productId);
            if (query.rating) params.set('rating', String(query.rating));

            const res = await fetch(`${API_URL}/admin/reviews?${params}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (!res.ok) throw new Error('Failed to fetch reviews');
            return res.json() as Promise<ReviewsResponse>;
        },
        placeholderData: (prev) => prev,
    });
};

// ── DELETE review ─────────────────────────────────────────────
export const useDeleteReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_URL}/admin/reviews/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            if (!res.ok) throw new Error('Failed to delete review');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};