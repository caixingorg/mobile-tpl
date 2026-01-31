/*
 * 通用 API 类型
 */

/** API 通用响应 */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  msg: string;
}

/** 分页请求参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页响应数据 */
export interface PaginationData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** HTTP 方法 */
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
