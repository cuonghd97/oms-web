import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Database, Package, Tags, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCachePage() {
  const clearProducts = useMutation({ mutationFn: () => apiClient.delete('/api/v1/admin/cache/products'), onSuccess: () => toast.success('Product cache cleared') });
  const clearCategories = useMutation({ mutationFn: () => apiClient.delete('/api/v1/admin/cache/categories'), onSuccess: () => toast.success('Category cache cleared') });
  const clearAll = useMutation({ mutationFn: () => apiClient.delete('/api/v1/admin/cache/all'), onSuccess: () => toast.success('All caches cleared') });

  const actions = [
    { label: 'Product Cache', icon: Package, mutation: clearProducts, color: 'text-blue-600 bg-blue-50' },
    { label: 'Category Cache', icon: Tags, mutation: clearCategories, color: 'text-green-600 bg-green-50' },
    { label: 'All Caches', icon: Database, mutation: clearAll, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Cache Management</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {actions.map((a) => (
          <div key={a.label} className="rounded-xl border border-border bg-white p-6 text-center">
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${a.color}`}><a.icon size={24} /></div>
            <h3 className="mb-1 font-semibold">{a.label}</h3>
            <p className="mb-4 text-xs text-muted-foreground">Clear cached data</p>
            <button onClick={() => a.mutation.mutate()} disabled={a.mutation.isPending} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50">
              <Trash2 size={14} /> {a.mutation.isPending ? 'Clearing...' : 'Clear'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
