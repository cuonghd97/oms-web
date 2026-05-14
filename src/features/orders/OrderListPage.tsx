import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import type { Order } from '@/types/order';
import type { ApiResponse, PagedResponse } from '@/types/api';

export default function OrderListPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['myOrders', page],
    queryFn: () => apiClient.get<ApiResponse<PagedResponse<Order>>>(`/api/v1/orders?page=${page}&size=10`).then((r) => r.data.data),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
      {isLoading ? <div className="py-20 text-center text-muted-foreground">Loading...</div> : (
        <div className="space-y-3">
          {data?.items.length === 0 && <p className="py-10 text-center text-muted-foreground">No orders yet.</p>}
          {data?.items.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between rounded-xl border border-border bg-white p-4 hover:shadow-md transition-shadow">
              <div>
                <h3 className="font-semibold">{order.orderCode}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)} · {order.items.length} items</p>
              </div>
              <div className="text-right">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
                <p className="mt-1 font-semibold text-accent">{formatCurrency(order.totalAmount)}</p>
              </div>
            </Link>
          ))}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)} className={`rounded px-3 py-1 text-sm ${page === i ? 'bg-accent text-white' : 'border hover:bg-muted'}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
