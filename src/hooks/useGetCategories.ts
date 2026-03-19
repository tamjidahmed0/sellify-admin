import { useQuery } from '@tanstack/react-query';
import getCategories from '../api/getCategories';
import type { CategoriesResponse } from '../types';

export const useGetCategories = () => {
    return useQuery<CategoriesResponse>({
        queryKey: ['category'],
        queryFn: getCategories,
        staleTime: 1000 * 60, // 1 min
        retry: 1, // 1 retry on failure
    });
};