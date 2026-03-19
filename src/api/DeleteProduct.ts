const API_URL = import.meta.env.VITE_API_URL;

const deleteProduct = async (id: string) => {
    const response = await fetch(`${API_URL}/product/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Request failed" }));
        throw new Error(error.message ?? `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export default deleteProduct;