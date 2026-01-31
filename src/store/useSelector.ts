/*
 * 推荐使用 Zustand 官方 useShallow
 * 本文件保留用于兼容，建议逐步迁移
 */
import { useShallow } from 'zustand/react/shallow';

export { useShallow };

/**
 * 兼容旧版 useSelector，建议迁移到 useShallow
 * @deprecated 请使用 useShallow
 */
export function useSelector<T extends object, K extends keyof T>(
  fields?: K[] | readonly K[]
): (state: T) => Pick<T, K> {
  return useShallow((state: T) => {
    if (!fields) return state;
    const result = {} as Pick<T, K>;
    fields.forEach(key => {
      result[key] = state[key];
    });
    return result;
  });
}
