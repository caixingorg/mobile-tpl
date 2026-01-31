// API 相关常量
export const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL || '/api';
export const API_TIMEOUT = 20000;

// 状态码
export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

// 业务状态码
export const BUSINESS_CODE = {
  SUCCESS: 200,
  ERROR: 500,
  UNAUTHORIZED: 401,
} as const;
