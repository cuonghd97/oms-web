import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { formatDate } from '@/lib/utils';
import type { AuditLog } from '@/types/order';
import type { ApiResponse, PagedResponse } from '@/types/api';

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useQuery({ queryKey: ['auditLogs', page], queryFn: () => apiClient.get<ApiResponse<PagedResponse<AuditLog>>>(`/api/v1/admin/audit-logs?page=${page}&size=20`).then((r) => r.data.data) });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Audit Logs</h1>
      {isLoading ? <p>Loading...</p> : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50"><tr><th className="px-4 py-3 text-left">Event</th><th className="px-4 py-3 text-left">Action</th><th className="px-4 py-3 text-left">Aggregate</th><th className="px-4 py-3 text-left">Date</th></tr></thead>
            <tbody>{data?.items.map((log) => (
              <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3"><span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{log.eventType}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{log.action}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.aggregateType}:{log.aggregateId}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(log.createdAt)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {data && data.totalPages > 1 && (<div className="mt-4 flex justify-center gap-2">{Array.from({ length: data.totalPages }, (_, i) => (<button key={i} onClick={() => setPage(i)} className={`rounded px-3 py-1 text-sm ${page === i ? 'bg-accent text-white' : 'border hover:bg-muted'}`}>{i + 1}</button>))}</div>)}
    </div>
  );
}
