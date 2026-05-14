import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute, AdminGuard, GuestRoute } from '@/features/auth/RouteGuards';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import ProductListPage from '@/features/products/ProductListPage';
import ProductDetailPage from '@/features/products/ProductDetailPage';
import CartPage from '@/features/cart/CartPage';
import OrderListPage from '@/features/orders/OrderListPage';
import OrderDetailPage from '@/features/orders/OrderDetailPage';
import NotificationPage from '@/features/notifications/NotificationPage';
import DashboardPage from '@/features/admin/dashboard/DashboardPage';
import AdminProductsPage from '@/features/admin/products/AdminProductsPage';
import AdminCategoriesPage from '@/features/admin/categories/AdminCategoriesPage';
import AdminInventoriesPage from '@/features/admin/inventories/AdminInventoriesPage';
import AdminOrdersPage from '@/features/admin/orders/AdminOrdersPage';
import AdminReportsPage from '@/features/admin/reports/AdminReportsPage';
import AdminAuditLogsPage from '@/features/admin/auditLogs/AdminAuditLogsPage';
import AdminCachePage from '@/features/admin/cache/AdminCachePage';

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { path: '/', element: <ProductListPage /> },
          { path: '/products', element: <ProductListPage /> },
          { path: '/products/:id', element: <ProductDetailPage /> },
          { path: '/cart', element: <CartPage /> },
          { path: '/orders', element: <OrderListPage /> },
          { path: '/orders/:id', element: <OrderDetailPage /> },
          { path: '/notifications', element: <NotificationPage /> },
        ],
      },
      {
        element: <AdminGuard />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: '/admin/dashboard', element: <DashboardPage /> },
              { path: '/admin/products', element: <AdminProductsPage /> },
              { path: '/admin/categories', element: <AdminCategoriesPage /> },
              { path: '/admin/inventories', element: <AdminInventoriesPage /> },
              { path: '/admin/orders', element: <AdminOrdersPage /> },
              { path: '/admin/reports', element: <AdminReportsPage /> },
              { path: '/admin/audit-logs', element: <AdminAuditLogsPage /> },
              { path: '/admin/cache', element: <AdminCachePage /> },
            ],
          },
        ],
      },
    ],
  },
]);
