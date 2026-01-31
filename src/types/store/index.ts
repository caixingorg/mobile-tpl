/*
 * Store 类型定义
 */

import { RouteObject } from 'react-router-dom';

// App Store
export interface AppState {
  token: string;
}

export interface AppActions {
  SET_TOKEN: (token: string) => void;
  REMOVE_TOKEN: () => void;
  RESET: () => void;
  SET_STATE: (data: { key: keyof AppState; val: AppState[keyof AppState] }) => void;
}

// Settings Store
export type Theme = 'dark' | 'light';
export type Lang = 'zh' | 'en';

export interface SettingsState {
  theme: Theme;
  lang: Lang;
}

export interface SettingsActions {
  SET_THEME: (theme: Theme) => void;
}

// Permission Store
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

export interface PermissionState {
  routes: Array<Route>;
}

export interface PermissionActions {
  SET_ROUTER: (routes: Array<Route>) => void;
  REMOVE_ROUTER: () => void;
  GenerateRoutes: () => Promise<RouteObject[]>;
}
