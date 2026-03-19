import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateProduct, { type UpdateProductPayload } from "../api/UpdateProduct";

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, UpdateProductPayload>({
        mutationFn: updateProduct,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["author-products"] });
        },

        onError: (error) => {
            console.error("Failed to update product:", error.message);
        },
    });
};