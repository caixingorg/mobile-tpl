/*
 * @Author: flynn * @Date: 2023-03-23 18:32:14
 * @LastEditors: flynn
 * @LastEditTime: 2024-03-29 17:01:24
 * @description: 接口request类型定义
 */

/**
 * 接口request数据类型
 */
declare namespace Req {
  /**
   * HTTP 方法
   */
  type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

  /**
   * 基础请求参数接口
   */
  interface BaseParams {
    url: string;
    method: Method;
    headers?: Record<string, string>;
    timeout?: number;
  }

  /**
   * GET 请求参数接口
   */
  interface GetParams extends BaseParams {
    method: 'GET';
    params?: Record<string, unknown>;
  }

  /**
   * POST 请求参数接口
   */
  interface PostParams extends BaseParams {
    method: 'POST';
    data?: Record<string, unknown> | FormData;
  }

  /**
   * 请求配置接口
   */
  interface RequestConfig {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
  }

  /**
   * 响应数据接口
   */
  interface Response<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
  }

  /**
   * 错误信息接口
   */
  interface ErrorInfo {
    message: string;
    code?: string | number;
    response?: Response;
  }
}
