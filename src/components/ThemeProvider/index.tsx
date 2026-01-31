import { useEffect } from 'react';
import { useSettings } from '@/store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettings(state => state.theme);

  useEffect(() => {
    // 应用主题到 document
    document.documentElement.setAttribute('data-theme', theme);

    // 应用 antd-mobile 主题色
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#fff';
    } else {
      document.body.style.backgroundColor = '#f5f5f5';
      document.body.style.color = '#333';
    }
  }, [theme]);

  return <>{children}</>;
}
