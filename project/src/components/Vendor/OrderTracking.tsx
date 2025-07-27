import React from 'react';
import { Package, Clock, CheckCircle, Truck, MapPin } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const OrderTracking: React.FC = () => {
  const { orders } = useApp();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return Clock;
      case 'accepted':
        return CheckCircle;
      case 'out_for_delivery':
        return Truck;
      case 'delivered':
        return Package;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'text-yellow-600 bg-yellow-100';
      case 'accepted':
        return 'text-blue-600 bg-blue-100';
      case 'out_for_delivery':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDeliveryETA = (status: string) => {
    switch (status) {
      case 'placed':
        return 'Waiting for supplier acceptance';
      case 'accepted':
        return 'Preparing order - ETA 2-3 hours';
      case 'out_for_delivery':
        return 'Out for delivery - ETA 30-45 mins';
      case 'delivered':
        return 'Order delivered';
      case 'rejected':
        return 'Order rejected by supplier';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
        <div className="text-sm text-gray-600">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Your orders will appear here once you place them</p>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const StatusIcon = getStatusIcon(order.status);
            const statusColor = getStatusColor(order.status);
            
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()} • ₹{order.totalAmount}
                      </p>
                    </div>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${statusColor}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-sm font-medium capitalize">
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Status */}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{getDeliveryETA(order.status)}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Items ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div key={item.productId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} {item.product.unit} × ₹{item.product.pricePerUnit}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">
                          ₹{(item.quantity * item.product.pricePerUnit).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Progress */}
                <div className="p-6 bg-gray-50">
                  <div className="flex items-center justify-between">
                    {['placed', 'accepted', 'out_for_delivery', 'delivered'].map((step, index) => {
                      const isCompleted = ['placed', 'accepted', 'out_for_delivery', 'delivered'].indexOf(order.status) >= index;
                      const isCurrent = order.status === step;
                      
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isCurrent 
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-xs">{index + 1}</span>
                            )}
                          </div>
                          <span className="text-xs mt-1 capitalize text-center">
                            {step.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 bg-gray-300 h-1 rounded">
                    <div 
                      className="bg-green-500 h-1 rounded transition-all"
                      style={{ 
                        width: `${((['placed', 'accepted', 'out_for_delivery', 'delivered'].indexOf(order.status) + 1) / 4) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payment Status</span>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;