import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { formatDate } from '@/lib/utils';
import { Bell, Check } from 'lucide-react';
import type { Notification } from '@/types/order';
import type { ApiResponse, PagedResponse } from '@/types/api';

export default function NotificationPage() {
  const [page, setPage] = useState(0);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => apiClient.get<ApiResponse<PagedResponse<Notification>>>(`/api/v1/notifications?page=${page}&size=20`).then((r) => r.data.data),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => apiClient.patch(`/api/v1/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Notifications</h1>
      {isLoading ? <div className="py-20 text-center text-muted-foreground">Loading...</div> : (
        <div className="space-y-2">
          {data?.items.length === 0 && <p className="py-10 text-center text-muted-foreground">No notifications</p>}
          {data?.items.map((n) => (
            <div key={n.id} className={`flex items-start gap-3 rounded-xl border p-4 transition ${n.read ? 'border-border bg-white' : 'border-accent/30 bg-accent/5'}`}>
              <Bell size={18} className={n.read ? 'text-muted-foreground' : 'text-accent'} />
              <div className="flex-1">
                <h3 className="font-semibold">{n.title}</h3>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
              </div>
              {!n.read && (
                <button onClick={() => markReadMutation.mutate(n.id)} className="rounded-lg p-1.5 text-accent hover:bg-accent/10"><Check size={16} /></button>
              )}
            </div>
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
