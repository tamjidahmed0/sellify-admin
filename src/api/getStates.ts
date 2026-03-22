import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;


const getStates = async () => {
    const token = Cookies.get('token')
    const response = await fetch(`${API_URL}/analytics/stats`, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!response.ok) throw new Error("Failed to fetch dashboard stats");
    return response.json();
};

export default getStates