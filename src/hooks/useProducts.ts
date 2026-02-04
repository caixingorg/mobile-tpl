/*
 * 商品数据 Hooks - 使用 React Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 模拟 API 调用
const fetchProducts = async () => {
  // 实际项目中替换为真实 API
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

const fetchProductById = async (id: string) => {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

// 获取商品列表
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

// 获取单个商品
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};

// 收藏商品 Mutation
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, isFavorite }: { productId: string; isFavorite: boolean }) => {
      const response = await fetch(`/api/products/${productId}/favorite`, {
        method: 'POST',
        body: JSON.stringify({ isFavorite }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      // 成功后刷新相关缓存
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// 添加到购物车 Mutation
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
      spec,
    }: {
      productId: string;
      quantity: number;
      spec?: string;
    }) => {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, spec }),
      });
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      return response.json();
    },
    onSuccess: () => {
      // 刷新购物车数据
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
