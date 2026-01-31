import { RouteObject } from 'react-router-dom';
import { createJSONStorage } from 'zustand/middleware';
import { StoreKey } from '@/common';
import { MakeState, createCustomStore } from '../store';

type Store = {
  routes: Array<Route>;
};

type Actions = {
  SET_ROUTER: (routes: Array<Route>) => void;
  REMOVE_ROUTER: () => void;
  GenerateRoutes: () => Promise<RouteObject[]>;
};

export type Route = {
  index?: boolean;
  id: string;
  path?: string;
  component: string;
  redirect?: string;
  children?: Array<Route>;
  handle?: {
    title?: string;
    icon?: string;
    roles?: string[];
  };
  parent?: string;
  protected?: boolean;
};

const APP_STORE_VERSION: number = 0.1;

const initialState = (): Store => ({
  routes: [],
});

export const usePermission = createCustomStore<Store, Actions>(
  StoreKey.PERMISSION,

  initialState(),

  set => ({
    SET_ROUTER(routes: Array<Route>) {
      set({ routes });
    },

    REMOVE_ROUTER() {
      set({ routes: [] });
    },

    GenerateRoutes: () => {
      return new Promise(resolve => {
        set({ routes: [] });
        resolve([]);
      });
    },
  }),

  {
    name: StoreKey.PERMISSION,
    storage: createJSONStorage(() => sessionStorage),
    version: APP_STORE_VERSION,
    migrate: (persistedState, version) => {
      const state = initialState();
      if (version !== APP_STORE_VERSION) {
        Object.assign(state, persistedState);
      }
      return state as Store & MakeState;
    },
  }
);
