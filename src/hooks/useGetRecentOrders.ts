import { useQuery } from "@tanstack/react-query";
 
const API_URL = import.meta.env.VITE_API_URL;


export const useGetRecentOrders = (limit = 10) => {
    return useQuery({
        queryKey: ["dashboard-recent-orders", limit],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/analytics/recent-orders?limit=${limit}`);
            if (!res.ok) throw new Error("Failed to fetch recent orders");
            return res.json();
        },
        staleTime: 1000 * 60 * 2,
    });
};