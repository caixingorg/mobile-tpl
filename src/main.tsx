import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './assets/styles/index.css';

// 初始化主题
const initTheme = () => {
  const savedTheme = sessionStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
};

initTheme();

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据缓存 5 分钟
      staleTime: 1000 * 60 * 5,
      // 失败重试次数
      retry: 2,
      // 窗口重新聚焦时刷新数据
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>
);
