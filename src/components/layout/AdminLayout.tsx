import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/authStore';
import {
  LayoutDashboard, Package, Tags, Warehouse, ClipboardList,
  BarChart3, ScrollText, Database, LogOut, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Categories', path: '/admin/categories', icon: Tags },
  { label: 'Inventory', path: '/admin/inventories', icon: Warehouse },
  { label: 'Orders', path: '/admin/orders', icon: ClipboardList },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: ScrollText },
  { label: 'Cache', path: '/admin/cache', icon: Database },
];

export function AdminLayout() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 flex h-full w-64 flex-col border-r border-border bg-white">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/admin/dashboard" className="text-xl font-bold text-accent">OMS Admin</Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon size={18} />
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-2 text-xs text-muted-foreground">{user?.email}</div>
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="ml-64 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
