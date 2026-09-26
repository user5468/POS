export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'vendedor';
  active: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  price: number;
  priceCase?: number;
  unitsPerCase?: number;
  cost: number;
  costCase?: number;
  stock: number;
  stockCases?: number;
  minStock: number;
  description: string;
  image?: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  items: any[];
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  cashier: string;
  date: string;
}

export interface CompanyConfig {
  name: string;
  address: string;
  rfc: string;
  phone: string;
  email: string;
  taxRate: number;
  currency: string;
}

export interface Promotion {
  id: string;
  name: string;
  type: string;
  value: number;
  active: boolean;
  startDate: string;
  endDate: string;
  description: string;
  applyTo?: string;
  categoryId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  startDate: string;
  endDate: string;
  description: string;
  perUserLimit?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  discount: number;
  totalPurchases: number;
  points: number;
  notes?: string;
  createdAt: string;
}

export interface CreditAccount {
  id: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: string;
  createdAt: string;
}

export interface ReturnSale {
  id: string;
  originalSaleId: string;
  items: any[];
  totalRefund: number;
  reason: string;
  method: string;
  cashier: string;
  date: string;
  status: string;
}

export interface Layaway {
  id: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: string;
  createdAt: string;
}

export interface Kit {
  id: string;
  name: string;
  items: any[];
  kitPrice: number;
  originalPrice: number;
  discount: number;
  discountPercentage: number;
  active: boolean;
  description: string;
  createdAt: string;
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  productName: string;
  type: string;
  quantity: number;
  reason: string;
  user: string;
  date: string;
}

export interface CashRegister {
  id: string;
  openDate: string;
  closeDate?: string;
  initialAmount: number;
  finalAmount?: number;
  status: string;
  cashier: string;
}
