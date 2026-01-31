import { Suspense, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import Loading from '@/components/Loading';
import ThemeProvider from '@/components/ThemeProvider';
import r, { generateRouter } from './router';
import { usePermission } from './store';
import { useShallow } from 'zustand/react/shallow';

export default function App() {
  const [router, setRouter] = useState(r);
  const { GenerateRoutes } = usePermission(
    useShallow((state: { GenerateRoutes: () => Promise<RouteObject[]> }) => ({
      GenerateRoutes: state.GenerateRoutes,
    }))
  );

  useEffect(() => {
    GenerateRoutes().then((routes: RouteObject[]) => {
      setRouter(generateRouter(routes));
    });
  }, [GenerateRoutes]);

  return (
    <ThemeProvider>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
}
