import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/authStore';
import { useCartStore } from '@/features/cart/cartStore';
import { ShoppingCart, Package, Bell, LogOut, User } from 'lucide-react';

export function CustomerLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const itemCount = useCartStore((s) => s.getItemCount)();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/products" className="text-xl font-bold text-accent">OMS Shop</Link>
          <nav className="flex items-center gap-6">
            <Link to="/products" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Package size={18} /> Products
            </Link>
            <Link to="/cart" className="relative flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart size={18} /> Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">{itemCount}</span>
              )}
            </Link>
            <Link to="/orders" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Package size={18} /> Orders
            </Link>
            <Link to="/notifications" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={18} /> Notifications
            </Link>
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User size={16} /> {user?.fullName}
              </span>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
