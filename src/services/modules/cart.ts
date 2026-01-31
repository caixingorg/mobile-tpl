/*
 * 购物车相关 API
 */
import { request } from '@/services/http';

/** 获取购物车列表 */
export const getCartList = () =>
  request.get<{
    list: Array<{
      id: number;
      productId: number;
      name: string;
      spec: string;
      price: number;
      quantity: number;
      image: string;
    }>;
  }>('/api/cart');

/** 添加商品到购物车 */
export const addToCart = (data: { productId: number; quantity: number; spec?: string }) =>
  request.post('/api/cart', data);

/** 更新购物车商品数量 */
export const updateCartItem = (id: number, quantity: number) =>
  request.put(`/api/cart/${id}`, { quantity });

/** 删除购物车商品 */
export const deleteCartItem = (id: number) => request.delete(`/api/cart/${id}`);
