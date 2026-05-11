import axiosInstance from '@/lib/axios';

export const searchProducts = async (query: string) => {
    if (!query) return [];
    const { data } = await axiosInstance.get(`products?select=*&title=ilike.*${query}*`);
    return data;
};