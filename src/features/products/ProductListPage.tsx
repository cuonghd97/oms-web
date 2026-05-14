import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import { useCartStore } from '@/features/cart/cartStore';
import { formatCurrency, getStatusColor } from '@/lib/utils';
import { ShoppingCart, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, Category } from '@/types/product';
import type { ApiResponse, PagedResponse } from '@/types/api';

export default function ProductListPage() {
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [page, setPage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.get<ApiResponse<Category[]>>('/api/v1/categories').then((r) => r.data.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', keyword, categoryId, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (categoryId) params.append('categoryId', categoryId);
      params.append('page', String(page));
      params.append('size', '12');
      return apiClient.get<ApiResponse<PagedResponse<Product>>>(`/api/v1/products?${params}`).then((r) => r.data.data);
    },
  });

  const handleAddToCart = (product: Product) => {
    addItem({ productId: product.id, productName: product.name, productSku: product.sku, price: product.price, quantity: 1 });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Products</h1>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(0); }} placeholder="Search products..." className="w-full rounded-lg border border-input bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
        </div>
        <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(0); }} className="rounded-lg border border-input bg-white px-4 py-2.5 text-sm outline-none focus:border-accent">
          <option value="">All Categories</option>
          {categoriesRes?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.items.map((product) => (
              <div key={product.id} className="group rounded-xl border border-border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/products/${product.id}`}>
                  <div className="mb-3 flex h-40 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-blue-50">
                    <span className="text-4xl">📦</span>
                  </div>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusColor(product.status)}`}>{product.status}</span>
                  <h3 className="mt-1 font-semibold text-foreground group-hover:text-accent transition-colors">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.categoryName} · {product.sku}</p>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-accent">{formatCurrency(product.price)}</span>
                  <button onClick={() => handleAddToCart(product)} className="rounded-lg bg-accent/10 p-2 text-accent hover:bg-accent hover:text-white transition-colors">
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {data && data.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${page === i ? 'bg-accent text-white' : 'bg-white border border-border hover:bg-muted'}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
