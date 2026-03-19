import { useQuery } from "@tanstack/react-query";

export interface ProductDetail {
    id: string | number;
    name: string;
    categoryId: string;
    originalPrice: string;
    price: string;
    stock: number;
    thumbnailUrl: string;       // backend থেকে আসা URL
    imageUrls: string[];        // backend থেকে আসা URL array
}

// Mock fetcher — পরে real API দিয়ে replace করো
const fetchProductById = async (id: string | number): Promise<ProductDetail> => {
    // TODO: replace with real API call
    // const res = await fetch(`/api/products/${id}`);
    // return res.json();

    // Mock data
    return {
        id,
        name: "Sony WH-1000XM5",
        categoryId: "44ab2315-98e2-4b1d-b7f3-0b060353dcb5",
        originalPrice: "350",
        price: "280",
        stock: 15,
        thumbnailUrl: "https://picsum.photos/seed/thumb/400/400",
        imageUrls: [
            "https://picsum.photos/seed/img1/400/400",
            "https://picsum.photos/seed/img2/400/400",
            "https://picsum.photos/seed/img3/400/400",
        ],
    };
};

export const useGetProductById = (id: string | number | null) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProductById(id!),
        enabled: !!id,      // id থাকলেই fetch করবে
        staleTime: 0,       // edit এ সবসময় fresh data আনবে
    });
};