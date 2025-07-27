import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const GroupCart: React.FC = () => {
  const { cart, selectedGroup, updateCartQuantity, removeFromCart, createOrder, clearCart } = useApp();
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  const totalAmount = cart.reduce((sum, item) => sum + (item.product.pricePerUnit * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Mock split calculation (in real app, this would be calculated based on group member participation)
  const memberCount = selectedGroup?.currentMembers || 1;
  const splitAmount = totalAmount / memberCount;

  const handleQuantityChange = (productId: string, delta: number) => {
    const currentItem = cart.find(item => item.productId === productId);
    if (currentItem) {
      const newQuantity = currentItem.quantity + delta;
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        updateCartQuantity(productId, newQuantity);
      }
    }
  };

  const handleCheckout = () => {
    if (!selectedGroup) {
      toast.error('Please join a group first');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (totalAmount < selectedGroup.minOrderValue) {
      toast.error(`Minimum order value is ₹${selectedGroup.minOrderValue}`);
      return;
    }

    setShowPayment(true);
  };

  const handlePayment = () => {
    // Mock payment processing
    setTimeout(() => {
      createOrder(selectedGroup!.id, cart);
      setShowPayment(false);
    }, 2000);
  };

  if (!selectedGroup) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Join a Group to Start Shopping</h2>
        <p className="text-gray-600 mb-6">You need to be part of a buying group to add items to cart</p>
        <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
          Find Groups
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Group Cart</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Group: {selectedGroup.name}</p>
          <p className="text-xs text-gray-500">{memberCount} members</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Browse products and add items to your group cart</p>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Cart Items ({totalItems})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {cart.map(item => (
                <div key={item.productId} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">{item.product.category}</p>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{item.product.pricePerUnit}/{item.product.unit}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.productId, -1)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, 1)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{(item.product.pricePerUnit * item.quantity).toFixed(0)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700 mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="font-medium">₹{totalAmount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Group Members</span>
                <span className="font-medium">{memberCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your Share (approx.)</span>
                <span className="font-medium">₹{splitAmount.toFixed(0)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">₹{totalAmount.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {totalAmount < selectedGroup.minOrderValue && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Add ₹{(selectedGroup.minOrderValue - totalAmount).toFixed(0)} more to meet minimum order value
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={handleCheckout}
                disabled={totalAmount < selectedGroup.minOrderValue}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Proceed to Payment</span>
              </button>
              <button
                onClick={clearCart}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment</h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Your share</span>
                <span className="text-2xl font-bold text-gray-900">₹{splitAmount.toFixed(0)}</span>
              </div>
              <p className="text-sm text-gray-500">
                Total order: ₹{totalAmount} split among {memberCount} members
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
              <div className="space-y-2">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full p-3 border rounded-lg text-left ${
                    paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                  }`}
                >
                  <span className="font-medium">UPI</span>
                  <p className="text-sm text-gray-500">Pay using PhonePe, GooglePay, Paytm</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-3 border rounded-lg text-left ${
                    paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                  }`}
                >
                  <span className="font-medium">Card</span>
                  <p className="text-sm text-gray-500">Credit or Debit Card</p>
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCart;