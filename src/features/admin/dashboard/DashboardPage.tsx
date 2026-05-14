import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, ShoppingBag, TrendingUp, XCircle } from 'lucide-react';
import type { RevenueReport, TopProduct, OrderStatusSummary } from '@/types/order';
import type { ApiResponse } from '@/types/api';

const today = new Date();
const from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
const to = today.toISOString().split('T')[0];

export default function DashboardPage() {
  const { data: revenue } = useQuery({
    queryKey: ['revenue'], queryFn: () => apiClient.get<ApiResponse<RevenueReport>>(`/api/v1/admin/reports/revenue?from=${from}&to=${to}`).then((r) => r.data.data),
  });
  const { data: topProducts } = useQuery({
    queryKey: ['topProducts'], queryFn: () => apiClient.get<ApiResponse<TopProduct[]>>(`/api/v1/admin/reports/top-products?from=${from}&to=${to}`).then((r) => r.data.data),
  });
  const { data: statusSummary } = useQuery({
    queryKey: ['statusSummary'], queryFn: () => apiClient.get<ApiResponse<OrderStatusSummary[]>>('/api/v1/admin/reports/order-status-summary').then((r) => r.data.data),
  });

  const cards = [
    { label: 'Revenue', value: formatCurrency(revenue?.totalRevenue || 0), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Total Orders', value: revenue?.totalOrders || 0, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Completed', value: revenue?.completedOrders || 0, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Cancelled', value: revenue?.cancelledOrders || 0, icon: XCircle, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-white p-5">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${c.color}`}><c.icon size={20} /></div>
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="text-2xl font-bold">{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Top Products</h2>
          <div className="space-y-3">
            {topProducts?.map((p, i) => (
              <div key={p.productId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">{i + 1}</span>
                  <span className="text-sm font-medium">{p.productName}</span>
                </div>
                <span className="text-sm font-semibold text-accent">{formatCurrency(p.totalRevenue)}</span>
              </div>
            ))}
            {(!topProducts || topProducts.length === 0) && <p className="text-sm text-muted-foreground">No data</p>}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Order Status Summary</h2>
          <div className="space-y-3">
            {statusSummary?.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                <span className="text-sm">{s.status}</span>
                <span className="text-sm font-bold">{s.count}</span>
              </div>
            ))}
            {(!statusSummary || statusSummary.length === 0) && <p className="text-sm text-muted-foreground">No data</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
