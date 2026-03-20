import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

// ── Top Products
export const useGetTopProducts = (limit = 5) => {
    return useQuery({
        queryKey: ["dashboard-top-products", limit],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/analytics/top-products?limit=${limit}`);
            if (!res.ok) throw new Error("Failed to fetch top products");
            return res.json();
        },
        staleTime: 1000 * 60 * 5,
    });
};