import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import useAuthStore from 'src/store/authStore';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const PlayersPage = lazy(() => import('src/pages/players'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const TopPlayersAdd = lazy(() => import('src/pages/top-players-add'));
export const RecommendedPlayersAdd = lazy(() => import('src/pages/recommended-players-add'));

export const Orders = lazy(() => import('src/pages/orders'));
export const Transactions = lazy(() => import('src/pages/transactions'));
export const Withdrawals = lazy(() => import('src/pages/withdrawals'));
export const Prices = lazy(() => import('src/pages/prices'));

// ----------------------------------------------------------------------

export default function Router() {
  const token = useAuthStore((state) => state.token);

  const routes = useRoutes([
    {
      element: token ? (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'players', element: <PlayersPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'orders', element: <Orders /> },
        { path: 'transactions', element: <Transactions /> },
        { path: 'withdrawals', element: <Withdrawals /> },
        { path: 'prices', element: <Prices /> },
        { path: 'players/top-players-add', element: <TopPlayersAdd /> },
        { path: 'players/recommended-players-add', element: <RecommendedPlayersAdd /> },
      ],
    },
    {
      path: 'login',
      element: token ? <Navigate to="/" replace /> : <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
