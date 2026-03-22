import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;

const fetchCategoryBreakdown = async () => {
    const token = Cookies.get('token')
    const response = await fetch(`${API_URL}/analytics/category-breakdown`, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
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