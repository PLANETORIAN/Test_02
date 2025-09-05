'use client';
import { useState } from 'react';

export default function CartModal({ cart, isOpen, onClose, onRemoveItem, onBookAll }) {
  if (!isOpen) return null;

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price || 50), 0);
  };

  const groupedItems = cart.reduce((groups, item) => {
    const type = item.type || 'other';
    if (!groups[type]) groups[type] = [];
    groups[type].push(item);
    return groups;
  }, {});

  const typeIcons = {
    flight: '✈️',
    hotel: '🏨',
    train: '🚄',
    activity: '🎯',
    other: '📦'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Travel Cart</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-blue-100 mt-2">{cart.length} item{cart.length !== 1 ? 's' : ''} selected</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-600">Add some travel items to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([type, items]) => (
                <div key={type} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">{typeIcons[type]}</span>
                    {type.charAt(0).toUpperCase() + type.slice(1)}s ({items.length})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {item.name || item.airline || item.hotelName || `${type} booking`}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-600">{item.description}</div>
                          )}
                          {item.date && (
                            <div className="text-sm text-gray-500">📅 {item.date}</div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-green-600">${item.price || 50}</div>
                          <button
                            onClick={() => onRemoveItem && onRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-green-600">${getTotalPrice()}</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  alert(`Proceeding to book ${cart.length} items for $${getTotalPrice()}`);
                  if (onBookAll) onBookAll();
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Book All (${getTotalPrice()})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
