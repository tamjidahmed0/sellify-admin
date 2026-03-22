import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;


interface UpdateCategoryPayload {
    id: string;
    name?: string;
    image?: File | null;
}


const updateCategory = async ({ id, name, image }: UpdateCategoryPayload) => {
    const token = Cookies.get('token')
    const formData = new FormData();

    if (name) formData.append('name', name);
    if (image) formData.append('image', image);

    const response = await fetch(`${API_URL}/category/${id}`, {
        method: 'PATCH',
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


export default updateCategory