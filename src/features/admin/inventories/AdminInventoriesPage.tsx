import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import type { Inventory } from '@/types/product';
import type { ApiResponse, PagedResponse } from '@/types/api';

export default function AdminInventoriesPage() {
  const [page, setPage] = useState(0);
  const [adjustId, setAdjustId] = useState<number | null>(null);
  const [qty, setQty] = useState(0);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['inventories', page], queryFn: () => apiClient.get<ApiResponse<PagedResponse<Inventory>>>(`/api/v1/admin/inventories?page=${page}&size=20`).then((r) => r.data.data) });

  const increaseMut = useMutation({ mutationFn: (pid: number) => apiClient.post(`/api/v1/admin/inventories/${pid}/increase`, { quantity: qty }), onSuccess: () => { toast.success('Increased'); qc.invalidateQueries({ queryKey: ['inventories'] }); setAdjustId(null); } });
  const decreaseMut = useMutation({ mutationFn: (pid: number) => apiClient.post(`/api/v1/admin/inventories/${pid}/decrease`, { quantity: qty }), onSuccess: () => { toast.success('Decreased'); qc.invalidateQueries({ queryKey: ['inventories'] }); setAdjustId(null); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Error') });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Inventory</h1>
      {isLoading ? <p>Loading...</p> : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50"><tr><th className="px-4 py-3 text-left">Product ID</th><th className="px-4 py-3 text-right">Quantity</th><th className="px-4 py-3 text-right">Reserved</th><th className="px-4 py-3 text-right">Available</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>{data?.items.map((inv) => (
              <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">#{inv.productId}</td>
                <td className="px-4 py-3 text-right">{inv.quantity}</td>
                <td className="px-4 py-3 text-right">{inv.reservedQuantity}</td>
                <td className="px-4 py-3 text-right font-semibold">{inv.availableQuantity}</td>
                <td className="px-4 py-3 text-right">
                  {adjustId === inv.productId ? (
                    <div className="flex items-center justify-end gap-2">
                      <input type="number" value={qty} onChange={(e) => setQty(+e.target.value)} className="w-20 rounded border px-2 py-1 text-sm" min={1} />
                      <button onClick={() => increaseMut.mutate(inv.productId)} className="rounded bg-green-600 px-2 py-1 text-xs text-white">+</button>
                      <button onClick={() => decreaseMut.mutate(inv.productId)} className="rounded bg-red-500 px-2 py-1 text-xs text-white">−</button>
                      <button onClick={() => setAdjustId(null)} className="text-xs text-muted-foreground">✕</button>
                    </div>
                  ) : (
                    <button onClick={() => { setAdjustId(inv.productId); setQty(1); }} className="text-xs text-accent hover:underline">Adjust</button>
                  )}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
