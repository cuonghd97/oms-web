import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Category, CategoryRequest } from '@/types/product';
import type { ApiResponse } from '@/types/api';

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryRequest>({ name: '', description: '' });
  const qc = useQueryClient();

  const { data: categories, isLoading } = useQuery({ queryKey: ['categories'], queryFn: () => apiClient.get<ApiResponse<Category[]>>('/api/v1/categories').then((r) => r.data.data) });

  const saveMutation = useMutation({
    mutationFn: () => editId ? apiClient.put(`/api/v1/admin/categories/${editId}`, form) : apiClient.post('/api/v1/admin/categories', form),
    onSuccess: () => { toast.success(editId ? 'Updated' : 'Created'); qc.invalidateQueries({ queryKey: ['categories'] }); setShowForm(false); setEditId(null); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/v1/admin/categories/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['categories'] }); },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={() => { setForm({ name: '', description: '' }); setEditId(null); setShowForm(true); }} className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"><Plus size={16} /> Add</button>
      </div>
      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="rounded-lg border px-3 py-2 text-sm" />
            <input value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => saveMutation.mutate()} className="rounded-lg bg-accent px-4 py-2 text-sm text-white">Save</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}
      {isLoading ? <p>Loading...</p> : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Slug</th><th className="px-4 py-3 text-left">Description</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>{categories?.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{c.name}</td><td className="px-4 py-3 text-muted-foreground">{c.slug}</td><td className="px-4 py-3 text-muted-foreground">{c.description}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => { setForm({ name: c.name, description: c.description }); setEditId(c.id); setShowForm(true); }} className="mr-2 text-muted-foreground hover:text-accent"><Pencil size={14} /></button><button onClick={() => deleteMutation.mutate(c.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={14} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
