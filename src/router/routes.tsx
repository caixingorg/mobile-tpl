import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const BasicsLayout = lazy(() => import('@/layouts/basics'));
const HomePage = lazy(() => import('@/pages/home'));
const CategoryPage = lazy(() => import('@/pages/category'));
const CartPage = lazy(() => import('@/pages/cart'));
const ProfilePage = lazy(() => import('@/pages/profile'));
const ProductPage = lazy(() => import('@/pages/product'));
const LoginPage = lazy(() => import('@/pages/login'));
const ErrorPage = lazy(() => import('@/pages/error'));

const routes: RouteObject[] = [
  {
    path: '/',
    Component: BasicsLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'category', Component: CategoryPage },
      { path: 'cart', Component: CartPage },
      { path: 'profile', Component: ProfilePage },
    ],
  },
  {
    path: '/product/:id',
    Component: ProductPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '*',
    Component: ErrorPage,
  },
];

export default routes;
