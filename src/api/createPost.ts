import type { ProductFormData } from "../components/ui/AddProductModal/Types";

const API_URL = import.meta.env.VITE_API_URL;

const createPost = async (data: ProductFormData) => {
    const formData = new FormData();
    console.log(data.description, 'descriptiopn')

    // Text fields
    formData.append("name", data.name);
    formData.append("description", data.description ?? "");
    formData.append("originalPrice", data.originalPrice);
    formData.append("price", data.price);
    formData.append("stock", String(data.stock));


    const categoryIds = Array.isArray(data.categoryId)
        ? data.categoryId
        : data.categoryId
            ? [data.categoryId]
            : [];
    categoryIds.forEach((id) => formData.append("categoryId", id));

    // Single thumbnail file
    if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
    }

    // Multiple product images
    data.images.forEach((file) => {
        formData.append("images", file);
    });

    const response = await fetch(`${API_URL}/product/create`, {
        method: "POST",
        body: formData,

    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Request failed" }));
        throw new Error(error.message ?? `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export default createPost;