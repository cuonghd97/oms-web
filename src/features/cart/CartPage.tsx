import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from './cartStore';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api';
import type { Order } from '@/types/order';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const navigate = useNavigate();

  const createOrderMutation = useMutation({
    mutationFn: () =>
      apiClient.post<ApiResponse<Order>>('/api/v1/orders', {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }).then((r) => r.data.data),
    onSuccess: (order) => {
      clearCart();
      toast.success(`Order ${order.orderCode} created!`);
      navigate(`/orders/${order.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create order');
    },
  });

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="mt-4 rounded-lg bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent/90">Browse Products</button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-2xl">📦</div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.productName}</h3>
                <p className="text-xs text-muted-foreground">SKU: {item.productSku}</p>
                <p className="text-sm font-medium text-accent">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center rounded-lg border border-border">
                <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="px-2 py-1 hover:bg-muted"><Minus size={14} /></button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 hover:bg-muted"><Plus size={14} /></button>
              </div>
              <span className="w-24 text-right font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>{items.length}</span></div>
            <div className="flex justify-between border-t border-border pt-2 text-lg font-bold"><span>Total</span><span className="text-accent">{formatCurrency(getTotal())}</span></div>
          </div>
          <button onClick={() => createOrderMutation.mutate()} disabled={createOrderMutation.isPending} className="mt-6 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50 transition">
            {createOrderMutation.isPending ? 'Creating Order...' : 'Place Order'}
          </button>
          <button onClick={() => clearCart()} className="mt-2 w-full rounded-lg border border-border py-2 text-sm text-muted-foreground hover:bg-muted transition">Clear Cart</button>
        </div>
      </div>
    </div>
  );
}
