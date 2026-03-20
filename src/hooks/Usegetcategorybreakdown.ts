import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

const fetchCategoryBreakdown = async () => {
    const response = await fetch(`${API_URL}/analytics/category-breakdown`);
    if (!response.ok) throw new Error("Failed to fetch category breakdown");
    return response.json();
};

export const useGetCategoryBreakdown = () => {
    return useQuery({
        queryKey: ["dashboard-category-breakdown"],
        queryFn: fetchCategoryBreakdown,
        staleTime: 1000 * 60 * 5,
    });
};