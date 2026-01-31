/*
 * API 接口
 */
import { request } from '@/axios';
import type { CaptchaResponse } from '@/types/api';

/** 测试接口 - 获取验证码 */
export const getCaptcha = (params: { phone?: string }) =>
  request.get<CaptchaResponse>('/api/captcha', params);
