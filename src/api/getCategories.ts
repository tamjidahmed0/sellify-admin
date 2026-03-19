const API_URL = import.meta.env.VITE_API_URL;

const getCategories = async () => {
    const res = await fetch(`${API_URL}/category/author`);
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    return data;
};

export default getCategories