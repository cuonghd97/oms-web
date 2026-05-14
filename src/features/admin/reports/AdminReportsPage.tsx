import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { formatCurrency } from '@/lib/utils';
import type { RevenueReport, TopProduct, CustomerOrder } from '@/types/order';
import type { ApiResponse } from '@/types/api';

const today = new Date();
const defaultFrom = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
const defaultTo = today.toISOString().split('T')[0];

export default function AdminReportsPage() {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);

  const { data: revenue } = useQuery({ queryKey: ['reportRevenue', from, to], queryFn: () => apiClient.get<ApiResponse<RevenueReport>>(`/api/v1/admin/reports/revenue?from=${from}&to=${to}`).then((r) => r.data.data) });
  const { data: topProducts } = useQuery({ queryKey: ['reportTop', from, to], queryFn: () => apiClient.get<ApiResponse<TopProduct[]>>(`/api/v1/admin/reports/top-products?from=${from}&to=${to}`).then((r) => r.data.data) });
  const { data: customers } = useQuery({ queryKey: ['reportCustomers', from, to], queryFn: () => apiClient.get<ApiResponse<CustomerOrder[]>>(`/api/v1/admin/reports/customer-orders?from=${from}&to=${to}`).then((r) => r.data.data) });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Reports</h1>
      <div className="mb-6 flex gap-3 items-center">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
        <span className="text-muted-foreground">to</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
      </div>
      {revenue && (
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-4"><p className="text-sm text-muted-foreground">Revenue</p><p className="text-xl font-bold text-green-600">{formatCurrency(revenue.totalRevenue)}</p></div>
          <div className="rounded-xl border bg-white p-4"><p className="text-sm text-muted-foreground">Total Orders</p><p className="text-xl font-bold">{revenue.totalOrders}</p></div>
          <div className="rounded-xl border bg-white p-4"><p className="text-sm text-muted-foreground">Completed</p><p className="text-xl font-bold text-green-600">{revenue.completedOrders}</p></div>
          <div className="rounded-xl border bg-white p-4"><p className="text-sm text-muted-foreground">Cancelled</p><p className="text-xl font-bold text-red-500">{revenue.cancelledOrders}</p></div>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6"><h2 className="mb-4 font-semibold">Top Products</h2>
          <table className="w-full text-sm"><thead><tr><th className="pb-2 text-left">#</th><th className="pb-2 text-left">Product</th><th className="pb-2 text-right">Qty</th><th className="pb-2 text-right">Revenue</th></tr></thead>
            <tbody>{topProducts?.map((p, i) => (<tr key={p.productId}><td>{i + 1}</td><td>{p.productName}</td><td className="text-right">{p.totalQuantitySold}</td><td className="text-right font-medium">{formatCurrency(p.totalRevenue)}</td></tr>))}</tbody>
          </table>{(!topProducts || topProducts.length === 0) && <p className="text-sm text-muted-foreground">No data</p>}
        </div>
        <div className="rounded-xl border bg-white p-6"><h2 className="mb-4 font-semibold">Customer Orders</h2>
          <table className="w-full text-sm"><thead><tr><th className="pb-2 text-left">Customer</th><th className="pb-2 text-right">Orders</th><th className="pb-2 text-right">Spent</th></tr></thead>
            <tbody>{customers?.map((c) => (<tr key={c.userId}><td>{c.fullName}<br /><span className="text-xs text-muted-foreground">{c.email}</span></td><td className="text-right">{c.totalOrders}</td><td className="text-right font-medium">{formatCurrency(c.totalSpent)}</td></tr>))}</tbody>
          </table>{(!customers || customers.length === 0) && <p className="text-sm text-muted-foreground">No data</p>}
        </div>
      </div>
    </div>
  );
}
