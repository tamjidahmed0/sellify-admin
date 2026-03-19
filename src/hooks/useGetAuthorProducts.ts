import { useQuery } from '@tanstack/react-query';
import getAuthorProducts from '../api/getAuthorProducts';
import type { ProductsResponse } from '../types';

export const useGetAuthorProducts = () => {
  return useQuery<ProductsResponse>({
    queryKey: ['author-products'],
    queryFn: getAuthorProducts,
    retry: 1,
  });
};