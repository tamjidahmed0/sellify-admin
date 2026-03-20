import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

const fetchTimeSeries = async (days: number) => {
    const response = await fetch(`${API_URL}/analytics/time-series?days=${days}`);
    if (!response.ok) throw new Error("Failed to fetch time series");
    return response.json();
};

export const useGetTimeSeries = (days: number) => {
    return useQuery({
        queryKey: ["dashboard-time-series", days],
        queryFn: () => fetchTimeSeries(days),
        // Refetch automatically when days changes
        staleTime: 1000 * 60 * 5, // cache for 5 minutes per range
    });
};