import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { useCartStore } from '@/features/cart/cartStore';
import { formatCurrency, getStatusColor } from '@/lib/utils';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types/product';
import type { ApiResponse } from '@/types/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => apiClient.get<ApiResponse<Product>>(`/api/v1/products/${id}`).then((r) => r.data.data),
  });

  if (isLoading) return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  if (!product) return <div className="py-20 text-center text-muted-foreground">Product not found</div>;

  const handleAdd = () => {
    addItem({ productId: product.id, productName: product.name, productSku: product.sku, price: product.price, quantity: qty });
    toast.success(`${product.name} x${qty} added to cart`);
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50 p-12">
          <span className="text-8xl">📦</span>
        </div>
        <div>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(product.status)}`}>{product.status}</span>
          <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.categoryName} · SKU: {product.sku}</p>
          <p className="mt-4 text-4xl font-bold text-accent">{formatCurrency(product.price)}</p>
          {product.description && <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-muted transition"><Minus size={16} /></button>
              <span className="w-12 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-muted transition"><Plus size={16} /></button>
            </div>
            <button onClick={handleAdd} className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition">
              <ShoppingCart size={16} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
