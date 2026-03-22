import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;

const getProductPrev = async (id: string) => {
    const token = Cookies.get('token')
    const res = await fetch(`${API_URL}/product/author/edit/preview/${id}`, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    return data;
};

export default getProductPrev