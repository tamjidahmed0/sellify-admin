import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateCategory from "../api/updateCategory";


export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category'] });
        },
        onError: (error) => {
            console.error('Failed to update category:', error.message);
        },
    });
};