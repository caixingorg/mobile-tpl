/*
 * 统一处理报错
 */
import type { AxiosResponse } from 'axios';
import { Toast } from 'antd-mobile';
import { useAppStore } from '@/store';
import router from '@/router';

/** 不需要 token 的接口列表 */
const noTokenUrl: string[] = ['app/main/getToken'];
/** 报错需要跳转降级页的状态码 -500 */
const to404Url: number[] = [];

/**
 * 统一处理报错
 * @param response 请求响应参数
 */
export default (response: AxiosResponse): void => {
  const code: number = response.data.code;
  const url: string = response.config.url ?? '';

  if (code === 401 && !noTokenUrl.includes(url)) {
    // 401 未登录
    useAppStore.getState().REMOVE_TOKEN();
    Toast.show({ icon: 'fail', content: '登录已过期，请重新登录' });
    router.navigate('/login', { replace: true });
  } else if (to404Url.includes(code)) {
    // 跳降级页
    window.location.href = '/404';
  } else if (code !== 200) {
    // 其他错误
    Toast.show({ icon: 'fail', content: response.data.msg || '请求失败' });
  }
};
