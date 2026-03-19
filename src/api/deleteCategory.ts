const API_URL = import.meta.env.VITE_API_URL;


export const deleteCategory = async (id: string) => {
    const response = await fetch(`${API_URL}/category/${id}`, {
        method: 'DELETE',
    });
 
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message ?? `HTTP error! status: ${response.status}`);
    }
 
    return response.json();
};