export interface Product {
  id: number;
  categoryId: number;
  categoryName: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  categoryId: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface Inventory {
  id: number;
  productId: number;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
}
