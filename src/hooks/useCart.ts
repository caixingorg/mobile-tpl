/*
 * 购物车 Hooks - 使用 React Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface CartItem {
  id: number;
  name: string;
  spec: string;
  price: number;
  quantity: number;
  image: string;
  checked: boolean;
}

// 模拟 API
const fetchCart = async (): Promise<CartItem[]> => {
  const response = await fetch('/api/cart');
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  return response.json();
};

const updateCartItem = async ({
  id,
  checked,
  quantity,
}: {
  id: number;
  checked?: boolean;
  quantity?: number;
}) => {
  const response = await fetch(`/api/cart/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ checked, quantity }),
  });
  if (!response.ok) {
    throw new Error('Failed to update cart');
  }
  return response.json();
};

// 获取购物车
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    staleTime: 1000 * 30, // 30 秒缓存
  });
};

// 更新购物车项
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// 删除购物车项
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// 全选/取消全选
export const useSelectAllCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checked: boolean) => {
      const response = await fetch('/api/cart/select-all', {
        method: 'POST',
        body: JSON.stringify({ checked }),
      });
      if (!response.ok) {
        throw new Error('Failed to select all');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
