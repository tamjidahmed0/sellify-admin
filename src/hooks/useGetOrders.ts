import { useQuery } from '@tanstack/react-query';
import type { OrdersQuery, OrdersResponse } from '../types';
import Cookies from 'js-cookie';
const API_URL = import.meta.env.VITE_API_URL;




const fetchOrders = async (query: OrdersQuery): Promise<OrdersResponse> => {
    const token = Cookies.get('token')
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.search) params.set('search', query.search);
    if (query.status) params.set('status', query.status);
    if (query.dateFrom) params.set('dateFrom', query.dateFrom);
    if (query.dateTo) params.set('dateTo', query.dateTo);

    const res = await fetch(`${API_URL}/order/author?${params}`,{
            headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
};



export const useGetOrders = (query: OrdersQuery) => {
    return useQuery({
        queryKey: ['orders', query],
        queryFn: () => fetchOrders(query),
        placeholderData: (prev) => prev, // keep old data while fetching new page
    });
};