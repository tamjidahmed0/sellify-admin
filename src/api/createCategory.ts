import Cookies from 'js-cookie';


interface CreateCategoryPayload {
    name: string;
    image?: File | null;
}


const API_URL = import.meta.env.VITE_API_URL;

const createCategory = async (payload: CreateCategoryPayload) => {
    const formData = new FormData();
    formData.append('name', payload.name);
    if (payload.image) formData.append('image', payload.image);

    const token = Cookies.get('token');

    const response = await fetch(`${API_URL}/category/create`, {
        method: 'POST',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message ?? `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export default createCategory