/*
 * 商品相关 API
 */
import { request } from '@/services/http';

/** 获取商品列表 */
export const getProductList = (params?: { page?: number; pageSize?: number; category?: string }) =>
  request.get<{
    list: Array<{
      id: number;
      name: string;
      price: number;
      image: string;
      sales: string;
    }>;
    total: number;
  }>('/api/products', params);

/** 获取商品详情 */
export const getProductDetail = (id: string) =>
  request.get<{
    id: number;
    name: string;
    desc: string;
    price: number;
    originalPrice: number;
    images: string[];
  }>(`/api/products/${id}`);
