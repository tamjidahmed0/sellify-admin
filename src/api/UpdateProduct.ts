// import type { ProductFormData } from "../components/ui/AddProductModal/Types";
import { type ProductFormData } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export interface UpdateProductPayload extends ProductFormData {
    id: string;
  
}

const updateProduct = async ({ id, ...data }: UpdateProductPayload) => {
    const formData = new FormData();

    // Text fields
    formData.append("name", data.name);
    formData.append("description", data.description ?? "");
    formData.append("originalPrice", data.originalPrice);
    formData.append("price", data.price);
    formData.append("stock", String(data.stock));

    // categoryId array — multiple append with same key
    const categoryIds = Array.isArray(data.categoryId)
        ? data.categoryId
        : data.categoryId
        ? [data.categoryId]
        : [];
    categoryIds.forEach((cid) => formData.append("categoryId", cid));

    // New thumbnail — only append if a new file was selected
    if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
    }

    // New images — only new File objects, not existing URLs
    data.images.forEach((file) => {
        formData.append("images", file);
    });

    // Existing image URLs the user kept — backend uses this to know what to delete
    (data.existingImageUrls ?? []).forEach((url) => {
        formData.append("existingImageUrls", url);
    });

    const response = await fetch(`${API_URL}/product/${id}`, {
        method: "PATCH",
        body: formData,
        // Do not set Content-Type — browser sets it with boundary automatically
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Request failed" }));
        throw new Error(error.message ?? `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export default updateProduct;