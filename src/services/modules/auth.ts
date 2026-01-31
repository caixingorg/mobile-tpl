/*
 * 认证相关 API
 */
import { request } from '@/services/http';
import type { CaptchaResponse } from '@/types/api';

/** 获取验证码 */
export const getCaptcha = (params: { phone?: string }) =>
  request.get<CaptchaResponse>('/api/captcha', params);

/** 登录 */
export const login = (data: { username: string; password: string }) =>
  request.post<{ token: string }>('/api/login', data);

/** 获取用户信息 */
export const getUserInfo = () =>
  request.get<{ id: string; username: string; avatar?: string }>('/api/user/info');
