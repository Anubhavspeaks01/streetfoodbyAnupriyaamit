import React, { createContext, useContext, useState } from 'react';
import { Group, Product, CartItem, Order, Notification } from '../types';
import { mockGroups, mockProducts } from '../lib/mockData';

interface AppContextType {
  groups: Group[];
  products: Product[];
  selectedGroup: Group | null;
  cart: CartItem[];
  orders: Order[];
  notifications: Notification[];
  setSelectedGroup: (group: Group | null) => void;
  addToCart: (productId: string, quantity: number, userId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (groupId: string, items: CartItem[]) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups] = useState<Group[]>(mockGroups);
  const [products] = useState<Product[]>(mockProducts);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addToCart = (productId: string, quantity: number, userId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { productId, product, quantity, addedBy: userId }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = (groupId: string, items: CartItem[]) => {
    const totalAmount = items.reduce((sum, item) => sum + (item.product.pricePerUnit * item.quantity), 0);
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      groupId,
      items,
      totalAmount,
      status: 'placed',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setOrders([...orders, newOrder]);
    clearCart();
    
    addNotification({
      userId: 'user1',
      title: 'Order Placed Successfully',
      message: `Your group order worth ₹${totalAmount} has been placed.`,
      type: 'success',
      read: false
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
    ));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  return (
    <AppContext.Provider value={{
      groups,
      products,
      selectedGroup,
      cart,
      orders,
      notifications,
      setSelectedGroup,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      createOrder,
      updateOrderStatus,
      addNotification,
      markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
};