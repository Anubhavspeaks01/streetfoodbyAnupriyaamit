import React from 'react';
import { Users, ShoppingCart, Package, TrendingUp, MapPin, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { selectedGroup, orders, cart } = useApp();
  
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => ['placed', 'accepted', 'out_for_delivery'].includes(o.status)).length;
  const cartValue = cart.reduce((sum, item) => sum + (item.product.pricePerUnit * item.quantity), 0);

  const stats = [
    {
      icon: Users,
      label: 'Group Members',
      value: selectedGroup ? `${selectedGroup.currentMembers}/${selectedGroup.maxMembers}` : 'No Group',
      color: 'text-blue-600 bg-blue-100',
      bgColor: 'bg-blue-50'
    },
    {
      icon: ShoppingCart,
      label: 'Cart Value',
      value: `₹${cartValue}`,
      color: 'text-green-600 bg-green-100',
      bgColor: 'bg-green-50'
    },
    {
      icon: Package,
      label: 'Active Orders',
      value: activeOrders,
      color: 'text-orange-600 bg-orange-100',
      bgColor: 'bg-orange-50'
    },
    {
      icon: TrendingUp,
      label: 'Total Orders',
      value: totalOrders,
      color: 'text-purple-600 bg-purple-100',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-orange-100">{user?.businessName}</p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{user?.pincode}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm">Credit Score: {user?.creditScore}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-orange-100">Loyalty Points</p>
            <p className="text-3xl font-bold">{user?.loyaltyPoints}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-4`}>
              <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Current Group */}
      {selectedGroup ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Group</h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{selectedGroup.name}</h3>
              <p className="text-gray-600">{selectedGroup.area}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">
                  Members: {selectedGroup.currentMembers}/{selectedGroup.maxMembers}
                </span>
                <span className="text-sm text-gray-500">
                  Min Order: ₹{selectedGroup.minOrderValue}
                </span>
                <span className="text-sm text-gray-500">
                  Delivery: {selectedGroup.deliveryDay}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                selectedGroup.status === 'open' 
                  ? 'bg-green-100 text-green-800' 
                  : selectedGroup.status === 'full'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedGroup.status}
              </span>
            </div>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full" 
              style={{ width: `${(selectedGroup.currentMembers / selectedGroup.maxMembers) * 100}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Join a Group</h2>
          <p className="text-gray-600 mb-4">
            You're not part of any buying group yet. Join a group to start bulk ordering and get wholesale rates!
          </p>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Find Groups Near Me
          </button>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} items • ₹{order.totalAmount}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'delivered' 
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'out_for_delivery'
                    ? 'bg-blue-100 text-blue-800'
                    : order.status === 'accepted'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;