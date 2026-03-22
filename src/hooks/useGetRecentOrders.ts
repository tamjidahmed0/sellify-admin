import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;


export const useGetRecentOrders = (limit = 10) => {
    return useQuery({
        queryKey: ["dashboard-recent-orders", limit],
        queryFn: async () => {
            const token = Cookies.get('token')
            const res = await fetch(`${API_URL}/analytics/recent-orders?limit=${limit}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (!res.ok) throw new Error("Failed to fetch recent orders");
            return res.json();
        },
        staleTime: 1000 * 60 * 2,
    });
};