import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { toast } from 'sonner';
import type { Order } from '@/types/order';
import type { ApiResponse, PagedResponse } from '@/types/api';

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [page, setPage] = useState(0);
  const [statusModal, setStatusModal] = useState<{ id: number; current: string } | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['adminOrders', page], queryFn: () => apiClient.get<ApiResponse<PagedResponse<Order>>>(`/api/v1/admin/orders?page=${page}&size=10`).then((r) => r.data.data) });

  const updateMut = useMutation({
    mutationFn: () => apiClient.patch(`/api/v1/admin/orders/${statusModal?.id}/status`, { status: newStatus }),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['adminOrders'] }); setStatusModal(null); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Error'),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>
      {statusModal && (
        <div className="mb-4 rounded-xl border border-border bg-white p-4 flex items-center gap-4">
          <span className="text-sm">Order #{statusModal.id} ({statusModal.current}) →</span>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="rounded border px-3 py-1.5 text-sm">
            <option value="">Select status</option>
            {STATUSES.filter((s) => s !== statusModal.current).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => updateMut.mutate()} disabled={!newStatus} className="rounded bg-accent px-3 py-1.5 text-sm text-white disabled:opacity-50">Update</button>
          <button onClick={() => setStatusModal(null)} className="text-sm text-muted-foreground">Cancel</button>
        </div>
      )}
      {isLoading ? <p>Loading...</p> : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50"><tr><th className="px-4 py-3 text-left">Order Code</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-center">Status</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>{data?.items.map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{o.orderCode}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 text-center"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(o.status)}`}>{o.status}</span></td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(o.totalAmount)}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => { setStatusModal({ id: o.id, current: o.status }); setNewStatus(''); }} className="text-xs text-accent hover:underline">Update</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {data && data.totalPages > 1 && (<div className="mt-4 flex justify-center gap-2">{Array.from({ length: data.totalPages }, (_, i) => (<button key={i} onClick={() => setPage(i)} className={`rounded px-3 py-1 text-sm ${page === i ? 'bg-accent text-white' : 'border hover:bg-muted'}`}>{i + 1}</button>))}</div>)}
    </div>
  );
}
