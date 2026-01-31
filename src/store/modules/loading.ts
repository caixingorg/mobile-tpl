/*
 * Loading 状态管理
 */
import { create } from 'zustand';

interface LoadingState {
  global: boolean;
  apis: Map<string, boolean>;
  setGlobal: (loading: boolean) => void;
  setApiLoading: (key: string, loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>(set => ({
  global: false,
  apis: new Map(),
  setGlobal: loading => set({ global: loading }),
  setApiLoading: (key, loading) =>
    set(state => {
      const apis = new Map(state.apis);
      if (loading) {
        apis.set(key, true);
      } else {
        apis.delete(key);
      }
      return { apis };
    }),
}));
