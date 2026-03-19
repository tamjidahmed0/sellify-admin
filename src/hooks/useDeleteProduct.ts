import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteProduct from "../api/DeleteProduct";

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, string>({
        mutationFn: deleteProduct,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["author-products"] });
        },

        onError: (error) => {
            console.error("Failed to delete product:", error.message);
        },
    });
};