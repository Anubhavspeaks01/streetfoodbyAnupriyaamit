import React, { useState } from 'react';
import { Home, Users, ShoppingCart, Package, User, Menu, X } from 'lucide-react';
import Header from './Layout/Header';
import BottomNav from './Layout/BottomNav';
import Dashboard from './Vendor/Dashboard';
import ProductCatalog from './Vendor/ProductCatalog';
import GroupManager from './Vendor/GroupManager';
import GroupCart from './Vendor/GroupCart';
import OrderTracking from './Vendor/OrderTracking';
import { useAuth } from '../contexts/AuthContext';

const VendorApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart' },
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'products':
        return <ProductCatalog />;
      case 'groups':
        return <GroupManager />;
      case 'cart':
        return <GroupCart />;
      case 'orders':
        return <OrderTracking />;
      case 'profile':
        return <div className="p-6">Profile content coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} showMenu />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left ${
                        isActive
                          ? 'bg-orange-100 text-orange-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 flex z-40">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 px-2 space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left ${
                          isActive
                            ? 'bg-orange-100 text-orange-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`} />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default VendorApp;