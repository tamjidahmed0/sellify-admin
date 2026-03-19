import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../api/deleteCategory";

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category'] });
        },
        onError: (error: any) => {
            console.error('Failed to delete category:', error.message);
        },
    });
};