export interface User {
  id: string;
  phone: string;
  email?: string;
  name: string;
  type: 'vendor' | 'supplier' | 'admin';
  pincode: string;
  address?: string;
  businessName?: string;
  creditScore: number;
  loyaltyPoints: number;
  verified: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  minOrderQty: number;
  image: string;
  description?: string;
  inStock: boolean;
}

export interface Group {
  id: string;
  name: string;
  pincode: string;
  area: string;
  maxMembers: number;
  currentMembers: number;
  minOrderValue: number;
  deliveryDay: string;
  status: 'open' | 'full' | 'active' | 'completed';
  createdAt: string;
  members: string[];
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedBy: string;
}

export interface GroupCart {
  groupId: string;
  items: CartItem[];
  totalAmount: number;
  splitAmounts: { [userId: string]: number };
}

export interface Order {
  id: string;
  groupId: string;
  supplierId?: string;
  items: CartItem[];
  totalAmount: number;
  status: 'placed' | 'accepted' | 'rejected' | 'out_for_delivery' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryETA?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}