/*
 * 用户相关 API 类型
 */

/** 登录参数 */
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
}

/** 登录响应 */
export interface LoginResponse {
  token: string;
  userId: string;
  username: string;
  avatar?: string;
}

/** 用户信息 */
export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  roles: string[];
}

/** 验证码响应 */
export interface CaptchaResponse {
  captchaImg: string;
  expireTime: number;
}
