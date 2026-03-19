const API_URL = import.meta.env.VITE_API_URL;


const getAuthorProducts = async () => {
    const res = await fetch(`${API_URL}/product/author/products`, {
        method: 'GET',

    });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    return res.json();
};

export default getAuthorProducts;