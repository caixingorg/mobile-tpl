/*
 * 用户相关 API
 */
import { request } from '@/services/http';

/** 获取用户信息 */
export const getUserProfile = () =>
  request.get<{
    id: string;
    username: string;
    avatar?: string;
    level: string;
    points: number;
    coupons: number;
  }>('/api/user/profile');

/** 更新用户信息 */
export const updateUserProfile = (data: { username?: string; avatar?: string }) =>
  request.put('/api/user/profile', data);

/** 获取收货地址列表 */
export const getAddressList = () =>
  request.get<
    Array<{
      id: string;
      name: string;
      phone: string;
      address: string;
      isDefault: boolean;
    }>
  >('/api/user/addresses');
