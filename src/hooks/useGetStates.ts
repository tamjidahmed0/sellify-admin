import { useQuery } from "@tanstack/react-query";
import getStates from "../api/getStates";




// ── Helper — calculate percentage change ──────────────────────
const formatChange = (current: number, lastMonth: number): string => {
    if (lastMonth === 0) return current > 0 ? "+100%" : "0%";
    const pct = ((current - lastMonth) / lastMonth) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
};

const isUp = (current: number, lastMonth: number): boolean => current >= lastMonth;

// ── Hook ──────────────────────────────────────────────────────
export const useGetStates = () => {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: getStates,
        // Transform raw API response into the same shape as STATS mock data
        select: (data) => [
            {
                label: "Total Revenue",
                value: `$${Number(data.revenue.total).toLocaleString()}`,
                change: formatChange(data.revenue.total, data.revenue.lastMonth),
                up: isUp(data.revenue.total, data.revenue.lastMonth),
                color: "bg-indigo-50 text-indigo-600",
                dot: "bg-indigo-500",
            },
            {
                label: "Total Orders",
                value: Number(data.orders.total).toLocaleString(),
                change: formatChange(data.orders.total, data.orders.lastMonth),
                up: isUp(data.orders.total, data.orders.lastMonth),
                color: "bg-emerald-50 text-emerald-600",
                dot: "bg-emerald-500",
            },
            {
                label: "Total Products",
                value: Number(data.products.total).toLocaleString(),
                change: formatChange(data.products.total, data.products.lastMonth),
                up: isUp(data.products.total, data.products.lastMonth),
                color: "bg-amber-50 text-amber-600",
                dot: "bg-amber-500",
            },
            {
                label: "Total Users",
                value: Number(data.users.total).toLocaleString(),
                change: formatChange(data.users.total, data.users.lastMonth),
                up: isUp(data.users.total, data.users.lastMonth),
                color: "bg-rose-50 text-rose-600",
                dot: "bg-rose-500",
            },
        ],
    });
};