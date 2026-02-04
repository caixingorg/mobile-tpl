/*
 * HTTP 请求封装
 */
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types/api';
import qs from 'qs';
import { cancelRequest } from './requestCancel';
import ErrorCodeHandle from './requestCode';
import { useAppStore } from '@/store';
import { ERROR_HANDLER_WHITELIST } from '@/constants/api';

// 创建实例
const service = axios.create({
  timeout: 20000,
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

// 请求拦截
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAppStore.getState().token;
    if (token) {
      config.headers['token'] = token;
    }
    cancelRequest.addPending(config);
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const url = response.config.url ?? '';
    cancelRequest.removePending(response.config);

    if (!ERROR_HANDLER_WHITELIST.some(e => url.match(e))) {
      ErrorCodeHandle(response);
    }

    if (response.data.code === 200) {
      return response;
    }
    return Promise.reject(response);
  },
  (error: AxiosError) => {
    if (error.code === 'ERR_CANCELED') {
      console.log('请求取消:', error.config?.url);
      return Promise.reject(error);
    }
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('请求超时');
    }
    return Promise.reject(error);
  }
);

// 简化的请求方法
export const request = {
  get: <T>(url: string, params?: object) =>
    service.get<ApiResponse<T>>(url, { params }).then(res => res.data),

  post: <T>(url: string, data?: object) =>
    service.post<ApiResponse<T>>(url, data).then(res => res.data),

  postForm: <T>(url: string, params?: object) =>
    service
      .post<ApiResponse<T>>(url, qs.stringify(params), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })
      .then(res => res.data),

  put: <T>(url: string, data?: object) =>
    service.put<ApiResponse<T>>(url, data).then(res => res.data),

  delete: <T>(url: string, params?: object) =>
    service.delete<ApiResponse<T>>(url, { params }).then(res => res.data),
};

export default service;
