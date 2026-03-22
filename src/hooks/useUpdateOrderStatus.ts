import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrderStatus } from "../types";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;




const updateOrderStatus = async ({ id, status }: { id: string; status: OrderStatus }) => {
    const token = Cookies.get('token')
    const res = await fetch(`${API_URL}/order/author/${id}/status`, {
        method: 'PATCH',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
};



export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};