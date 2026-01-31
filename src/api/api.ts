/*
 * API 接口
 */
import { request } from '@/axios';

/** 测试接口 - 获取验证码 */
export const getCaptcha = (params: { phone?: string }) =>
  request.get<{ captchaImg: string; expireTime: number }>('/api/captcha', params);
