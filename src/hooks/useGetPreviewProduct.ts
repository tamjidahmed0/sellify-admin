import { useQuery } from '@tanstack/react-query';
import getProductPrev from '../api/getProductPrev';

export const useGetProductPrev = (id: string) => {
    return useQuery({
        queryKey: ['previewedit', id],
        queryFn: () => getProductPrev(id),
        retry: 1, // 1 retry on failure
    });
};