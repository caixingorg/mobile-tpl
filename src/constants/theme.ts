// 主题相关常量
export const THEME_COLORS = {
  primary: '#ff5000',
  secondary: '#ff8a00',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  info: '#1890ff',
} as const;

export const THEME_CONFIG = {
  light: {
    background: '#f5f5f5',
    text: '#333',
    border: '#e8e8e8',
  },
  dark: {
    background: '#1a1a1a',
    text: '#fff',
    border: '#333',
  },
} as const;
