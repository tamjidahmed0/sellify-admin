import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;


const getAuthorProducts = async () => {
    const token = Cookies.get('token')
    const res = await fetch(`${API_URL}/product/author/products`, {
        method: 'GET',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },

    });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    return res.json();
};

export default getAuthorProducts;