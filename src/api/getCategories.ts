import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const getCategories = async () => {

    const token = Cookies.get('token')

    const res = await fetch(`${API_URL}/category/author`, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    return data;
};

export default getCategories