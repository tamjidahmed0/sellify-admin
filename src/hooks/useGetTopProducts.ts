import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;

// ── Top Products
export const useGetTopProducts = (limit = 5) => {
    return useQuery({
        queryKey: ["dashboard-top-products", limit],
        queryFn: async () => {
            const token = Cookies.get('token')
            const res = await fetch(`${API_URL}/analytics/top-products?limit=${limit}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (!res.ok) throw new Error("Failed to fetch top products");
            return res.json();
        },
        staleTime: 1000 * 60 * 5,
    });
};