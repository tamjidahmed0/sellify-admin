import { useMutation, useQueryClient } from "@tanstack/react-query";
import createCategory from "../api/createCategory";

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
 
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category'] });
        },
        onError: (error) => {
            console.error('Failed to create category:', error.message);
        },
    });
};