/**
 * React Query 配置常量
 */

export const QUERY_DEFAULT_OPTIONS = {
  queries: {
    staleTime: 1000 * 60 * 5, // 5分钟
    retry: 2,
    refetchOnWindowFocus: false,
  },
};

export const QUERY_STALE_TIME = {
  SHORT: 1000 * 60 * 2, // 2分钟
  MEDIUM: 1000 * 60 * 5, // 5分钟
  LONG: 1000 * 60 * 10, // 10分钟
};
