import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
const API_URL = import.meta.env.VITE_API_URL;

// ── Types ──────────────────────────────────────────────────────
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderDetail {
    id: string;
    rawId: string;
    status: OrderStatus;
    createdAt: string;
    totalPrice: number;
    customer: {
        name: string;
        email: string;
        picture: string | null;
    };
    address: {
        line: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string | null;
    };
    items: {
        id: string;
        productId: string;
        productName: string;
        productImage: string | null;
        quantity: number;
        price: number;
        subtotal: number;
    }[];
    statusHistory: {
        id: string;
        status: OrderStatus;
        note: string | null;
        createdAt: string;
    }[];
}

// ── API ────────────────────────────────────────────────────────
const fetchOrderById = async (id: string): Promise<OrderDetail> => {
    const token = Cookies.get('token')
    const res = await fetch(`${API_URL}/order/${id}`, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
    });
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
};

const updateStatus = async ({ id, status, note }: { id: string; status: OrderStatus; note?: string }) => {
    const token = Cookies.get('token')
    const res = await fetch(`${API_URL}/order/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),

        },
        body: JSON.stringify({ status, note }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
};

// ── Hooks ──────────────────────────────────────────────────────
export const useGetOrderById = (id: string) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: () => fetchOrderById(id),
        enabled: !!id,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateStatus,
        onSuccess: (_, variables) => {
            // Refresh both the detail page and the orders list
            queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};