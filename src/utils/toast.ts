/*
 * Toast 提示工具
 */
import { Toast } from 'antd-mobile';

export const toast = {
  success: (content: string) => {
    Toast.show({ icon: 'success', content });
  },
  fail: (content: string) => {
    Toast.show({ icon: 'fail', content });
  },
  loading: (content: string = '加载中...') => {
    return Toast.show({ icon: 'loading', content, duration: 0 });
  },
  clear: () => {
    Toast.clear();
  },
};
