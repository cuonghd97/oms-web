import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Order, Payment } from '@/types/order';
import type { ApiResponse } from '@/types/api';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => apiClient.get<ApiResponse<Order>>(`/api/v1/orders/${id}`).then((r) => r.data.data),
  });

  const { data: payment } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => apiClient.get<ApiResponse<Payment>>(`/api/v1/orders/${id}/payments`).then((r) => r.data.data),
    enabled: !!order,
  });

  const cancelMutation = useMutation({
    mutationFn: () => apiClient.post(`/api/v1/orders/${id}/cancel`),
    onSuccess: () => { toast.success('Order cancelled'); qc.invalidateQueries({ queryKey: ['order', id] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Cancel failed'),
  });

  const payMutation = useMutation({
    mutationFn: () => apiClient.post(`/api/v1/orders/${id}/payments/pay`),
    onSuccess: () => { toast.success('Payment successful!'); qc.invalidateQueries({ queryKey: ['payment', id] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Payment failed'),
  });

  const failMutation = useMutation({
    mutationFn: () => apiClient.post(`/api/v1/orders/${id}/payments/fail`),
    onSuccess: () => { toast.error('Payment failed (simulated)'); qc.invalidateQueries({ queryKey: ['payment', id] }); },
  });

  if (isLoading) return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  if (!order) return <div className="py-20 text-center">Order not found</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Back</button>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{order.orderCode}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-border bg-white p-4">
              <div>
                <h3 className="font-semibold">{item.productName}</h3>
                <p className="text-xs text-muted-foreground">SKU: {item.productSku} · Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="mb-3 font-semibold">Summary</h2>
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-accent">{formatCurrency(order.totalAmount)}</span></div>
          </div>
          {payment && (
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="mb-3 font-semibold">Payment</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(payment.status)}`}>{payment.status}</span>
              {payment.status === 'UNPAID' && (
                <div className="mt-4 space-y-2">
                  <button onClick={() => payMutation.mutate()} disabled={payMutation.isPending} className="w-full rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">Pay Now</button>
                  <button onClick={() => failMutation.mutate()} disabled={failMutation.isPending} className="w-full rounded-lg border border-red-300 py-2 text-sm text-red-600 hover:bg-red-50">Simulate Failure</button>
                </div>
              )}
            </div>
          )}
          {order.status === 'PENDING' && (
            <button onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending} className="w-full rounded-lg border border-red-300 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">Cancel Order</button>
          )}
        </div>
      </div>
    </div>
  );
}
