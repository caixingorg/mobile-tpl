import { useEffect } from 'react';
import { useSettings } from '@/store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettings(state => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

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
