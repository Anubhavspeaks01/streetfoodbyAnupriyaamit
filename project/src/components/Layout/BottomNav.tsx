import React from 'react';
import { Home, Users, ShoppingCart, Package, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { cart } = useApp();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', badge: cartItemCount },
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 relative ${
                isActive 
                  ? 'text-orange-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-orange-600' : ''}`} />
              <span className="text-xs mt-1">{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;