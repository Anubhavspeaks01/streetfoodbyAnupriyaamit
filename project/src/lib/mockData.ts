import { Product, Group, User } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Red Onions',
    category: 'Vegetables',
    unit: 'kg',
    pricePerUnit: 20,
    minOrderQty: 5,
    image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Fresh red onions from Maharashtra',
    inStock: true
  },
  {
    id: '2',
    name: 'Tomatoes',
    category: 'Vegetables',
    unit: 'kg',
    pricePerUnit: 15,
    minOrderQty: 3,
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Ripe tomatoes perfect for chutney',
    inStock: true
  },
  {
    id: '3',
    name: 'Cooking Oil (Refined)',
    category: 'Oil & Ghee',
    unit: 'liter',
    pricePerUnit: 120,
    minOrderQty: 2,
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Premium refined cooking oil',
    inStock: true
  },
  {
    id: '4',
    name: 'Garam Masala Powder',
    category: 'Spices',
    unit: 'kg',
    pricePerUnit: 250,
    minOrderQty: 1,
    image: 'https://images.pexels.com/photos/4198078/pexels-photo-4198078.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Authentic garam masala blend',
    inStock: true
  },
  {
    id: '5',
    name: 'Basmati Rice',
    category: 'Grains',
    unit: 'kg',
    pricePerUnit: 80,
    minOrderQty: 10,
    image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Premium basmati rice',
    inStock: true
  },
  {
    id: '6',
    name: 'Green Chilies',
    category: 'Vegetables',
    unit: 'kg',
    pricePerUnit: 40,
    minOrderQty: 1,
    image: 'https://images.pexels.com/photos/1437515/pexels-photo-1437515.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Fresh green chilies',
    inStock: true
  },
  {
    id: '7',
    name: 'Turmeric Powder',
    category: 'Spices',
    unit: 'kg',
    pricePerUnit: 180,
    minOrderQty: 1,
    image: 'https://images.pexels.com/photos/4198062/pexels-photo-4198062.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Pure turmeric powder',
    inStock: true
  },
  {
    id: '8',
    name: 'Coriander Powder',
    category: 'Spices',
    unit: 'kg',
    pricePerUnit: 200,
    minOrderQty: 1,
    image: 'https://images.pexels.com/photos/4198120/pexels-photo-4198120.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Freshly ground coriander powder',
    inStock: true
  }
];

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Connaught Place Vendors',
    pincode: '110001',
    area: 'Connaught Place, Delhi',
    maxMembers: 8,
    currentMembers: 6,
    minOrderValue: 2000,
    deliveryDay: 'Monday',
    status: 'open',
    createdAt: '2024-01-15',
    members: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6']
  },
  {
    id: '2',
    name: 'Karol Bagh Market',
    pincode: '110005',
    area: 'Karol Bagh, Delhi',
    maxMembers: 10,
    currentMembers: 10,
    minOrderValue: 3000,
    deliveryDay: 'Tuesday',
    status: 'full',
    createdAt: '2024-01-14',
    members: Array.from({length: 10}, (_, i) => `user${i+7}`)
  },
  {
    id: '3',
    name: 'Lajpat Nagar Vendors',
    pincode: '110024',
    area: 'Lajpat Nagar, Delhi',
    maxMembers: 6,
    currentMembers: 4,
    minOrderValue: 1500,
    deliveryDay: 'Wednesday',
    status: 'open',
    createdAt: '2024-01-16',
    members: ['user17', 'user18', 'user19', 'user20']
  }
];

export const mockUser: User = {
  id: 'user1',
  phone: '+91 9876543210',
  email: 'vendor@example.com',
  name: 'Rajesh Kumar',
  type: 'vendor',
  pincode: '110001',
  address: 'Shop 15, Connaught Place, New Delhi',
  businessName: 'Kumar Chat Corner',
  creditScore: 750,
  loyaltyPoints: 2450,
  verified: true,
  createdAt: '2024-01-01'
};