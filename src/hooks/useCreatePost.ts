import { useMutation, useQueryClient } from "@tanstack/react-query";
import {type ProductFormData } from "../types";
import createPost from "../api/createPost";



export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, ProductFormData>({
        mutationFn: createPost,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["post"] });
        },

        onError: (error) => {
            console.error("Failed to create post:", error.message);
        },
    });
};