import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './authStore';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function AdminGuard() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.roles?.some((r) => r === 'ADMIN' || r === 'STAFF');
  if (!isAdmin) return <Navigate to="/products" replace />;
  return <Outlet />;
}

export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)();
  const user = useAuthStore((s) => s.user);
  if (isAuthenticated) {
    const isAdmin = user?.roles?.some((r) => r === 'ADMIN' || r === 'STAFF');
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/products'} replace />;
  }
  return <Outlet />;
}
