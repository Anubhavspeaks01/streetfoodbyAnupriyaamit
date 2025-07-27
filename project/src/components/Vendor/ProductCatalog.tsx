import React, { useState } from 'react';
import { Search, Filter, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProductCatalog: React.FC = () => {
  const { products, addToCart, cart, selectedGroup } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.inStock;
  });

  const handleQuantityChange = (productId: string, delta: number) => {
    const currentQty = quantities[productId] || 0;
    const newQty = Math.max(0, currentQty + delta);
    setQuantities({ ...quantities, [productId]: newQty });
  };

  const handleAddToCart = (productId: string) => {
    if (!selectedGroup) {
      toast.error('Please join a group first to add items to cart');
      return;
    }

    const quantity = quantities[productId] || 1;
    const product = products.find(p => p.id === productId);
    
    if (product && quantity < product.minOrderQty) {
      toast.error(`Minimum order quantity is ${product.minOrderQty} ${product.unit}`);
      return;
    }

    addToCart(productId, quantity, user?.id || '');
    toast.success(`Added ${quantity} ${product?.unit} to group cart`);
    setQuantities({ ...quantities, [productId]: 0 });
  };

  const getCartQuantity = (productId: string) => {
    const cartItem = cart.find(item => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        <div className="text-sm text-gray-600">
          {filteredProducts.length} products available
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const cartQty = getCartQuantity(product.id);
          const currentQty = quantities[product.id] || 0;
          
          return (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {cartQty > 0 && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {cartQty} in cart
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-900">₹{product.pricePerUnit}</span>
                    <span className="text-sm text-gray-500">/{product.unit}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Min: {product.minOrderQty} {product.unit}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      disabled={currentQty <= 0}
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-medium">{currentQty}</span>
                    <button
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{(product.pricePerUnit * currentQty).toFixed(0)}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={currentQty === 0 || !selectedGroup}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>

                {!selectedGroup && (
                  <p className="text-xs text-red-500 mt-2 text-center">Join a group to order</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No products found</p>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;