import routes from './routes';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

export default createBrowserRouter(routes);

export function generateRouter(routes: RouteObject[]) {
  return createBrowserRouter(routes);
}
