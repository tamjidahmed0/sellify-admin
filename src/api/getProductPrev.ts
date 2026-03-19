const API_URL = import.meta.env.VITE_API_URL;

const getProductPrev = async (id: string) => {
    const res = await fetch(`${API_URL}/product/author/edit/preview/${id}`);
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    return data;
};

export default getProductPrev