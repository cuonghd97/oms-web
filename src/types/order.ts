export interface Order {
  id: number;
  orderCode: string;
  userId: number;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
}

export interface Payment {
  id: number;
  orderId: number;
  status: string;
  amount: number;
  paidAt?: string;
  failedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  readAt?: string;
}

export interface AuditLog {
  id: number;
  eventType: string;
  actorId?: number;
  aggregateType: string;
  aggregateId: string;
  action: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface RevenueReport {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface CustomerOrder {
  userId: number;
  fullName: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}

export interface OrderStatusSummary {
  status: string;
  count: number;
}
