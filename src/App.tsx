import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import Loading from '@/components/Loading';
import ThemeProvider from '@/components/ThemeProvider';
import router from './router';

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
}
