import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { formatCurrency, getStatusColor } from '@/lib/utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, Category, ProductRequest } from '@/types/product';
import type { ApiResponse, PagedResponse } from '@/types/api';

export default function AdminProductsPage() {
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductRequest>({ categoryId: 0, sku: '', name: '', description: '', price: 0 });
  const qc = useQueryClient();

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => apiClient.get<ApiResponse<Category[]>>('/api/v1/categories').then((r) => r.data.data) });
  const { data, isLoading } = useQuery({ queryKey: ['adminProducts', page], queryFn: () => apiClient.get<ApiResponse<PagedResponse<Product>>>(`/api/v1/products?page=${page}&size=10`).then((r) => r.data.data) });

  const saveMutation = useMutation({
    mutationFn: () => editId ? apiClient.put(`/api/v1/admin/products/${editId}`, form) : apiClient.post('/api/v1/admin/products', form),
    onSuccess: () => { toast.success(editId ? 'Updated' : 'Created'); qc.invalidateQueries({ queryKey: ['adminProducts'] }); setShowForm(false); setEditId(null); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/v1/admin/products/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['adminProducts'] }); },
  });

  const openEdit = (p: Product) => { setForm({ categoryId: p.categoryId, sku: p.sku, name: p.name, description: p.description || '', price: p.price }); setEditId(p.id); setShowForm(true); };
  const openNew = () => { setForm({ categoryId: categories?.[0]?.id || 0, sku: '', name: '', description: '', price: 0 }); setEditId(null); setShowForm(true); };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openNew} className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"><Plus size={16} /> Add Product</button>
      </div>
      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 font-semibold">{editId ? 'Edit' : 'New'} Product</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="rounded-lg border px-3 py-2 text-sm" />
            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU" className="rounded-lg border px-3 py-2 text-sm" />
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: +e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
              {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} placeholder="Price" className="rounded-lg border px-3 py-2 text-sm" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="col-span-2 rounded-lg border px-3 py-2 text-sm" rows={2} />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90 disabled:opacity-50">Save</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}
      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50"><tr><th className="px-4 py-3 text-left font-medium">Name</th><th className="px-4 py-3 text-left font-medium">SKU</th><th className="px-4 py-3 text-left font-medium">Category</th><th className="px-4 py-3 text-right font-medium">Price</th><th className="px-4 py-3 text-center font-medium">Status</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>{data?.items.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{p.name}</td><td className="px-4 py-3 text-muted-foreground">{p.sku}</td><td className="px-4 py-3">{p.categoryName}</td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3 text-center"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(p.status)}`}>{p.status}</span></td>
                <td className="px-4 py-3 text-right"><button onClick={() => openEdit(p)} className="mr-2 text-muted-foreground hover:text-accent"><Pencil size={14} /></button><button onClick={() => deleteMutation.mutate(p.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={14} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {data && data.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">{Array.from({ length: data.totalPages }, (_, i) => (<button key={i} onClick={() => setPage(i)} className={`rounded px-3 py-1 text-sm ${page === i ? 'bg-accent text-white' : 'border hover:bg-muted'}`}>{i + 1}</button>))}</div>
      )}
    </div>
  );
}
