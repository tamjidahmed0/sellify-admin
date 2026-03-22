import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

export interface Slide {
    id: string;
    badge: string;
    title: string;
    description: string;
    link: string;
    image: string;
    createdAt: string;
}

const token = Cookies.get('token')

// ── Fetch all slides ───────────────────────────────────────────
export const useGetSlides = () => {
    return useQuery({
        queryKey: ['slides'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/slides/admin/slides`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (!res.ok) throw new Error('Failed to fetch slides');
            return res.json() as Promise<Slide[]>;
        },
    });
};

// ── Delete slide ───────────────────────────────────────────────
export const useDeleteSlide = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_URL}/slides/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },

                });
            if (!res.ok) throw new Error('Failed to delete slide');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['slides'] });
        },
    });
};

// ── Fetch single slide by id ───────────────────────────────────
export const useGetSlideById = (id: string) => {
    return useQuery({
        queryKey: ['slide', id],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/slides/${id}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (!res.ok) throw new Error('Failed to fetch slide');
            return res.json() as Promise<Slide>;
        },
        enabled: !!id,
    });
};

// ── Create slide ───────────────────────────────────────────────
export const useCreateSlide = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await fetch(`${API_URL}/slides/create`, {
                method: 'POST',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });
            if (!res.ok) throw new Error('Failed to create slide');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['slides'] });
        },
    });
};

// ── Update slide ───────────────────────────────────────────────
export const useUpdateSlide = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
            const res = await fetch(`${API_URL}/slides/${id}`, {
                method: 'PATCH',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });
            if (!res.ok) throw new Error('Failed to update slide');
            return res.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['slides'] });
            queryClient.invalidateQueries({ queryKey: ['slide', variables.id] });
        },
    });
};