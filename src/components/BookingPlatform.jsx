'use client';
import { useState } from 'react';
import FlightBooking from './booking/FlightBooking';
import HotelBooking from './booking/HotelBooking';
import TrainBooking from './booking/TrainBooking';
import ActivityBooking from './booking/ActivityBooking';
import ItineraryBuilder from './booking/ItineraryBuilder';
import BookingCart from './booking/BookingCart';

export default function BookingPlatform({ user, onAddToCart }) {
  const [activeTab, setActiveTab] = useState('flights');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const tabs = [
    { id: 'flights', name: 'Flights', icon: '✈️' },
    { id: 'hotels', name: 'Hotels', icon: '🏨' },
    { id: 'trains', name: 'Trains', icon: '🚄' },
    { id: 'activities', name: 'Activities', icon: '🎯' },
    { id: 'itinerary', name: 'My Itinerary', icon: '📋' }
  ];

  const addToCart = (item) => {
    const cartItem = { ...item, id: Date.now() };
    setCart(prev => [...prev, cartItem]);
    if (onAddToCart) {
      onAddToCart(cartItem);
    }
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Travel Booking Platform
                </h1>
                <p className="text-sm text-gray-600">Plan your perfect journey</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🛒 Cart ({cart.length})
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <span className="text-gray-600">Welcome, {user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'flights' && <FlightBooking onAddToCart={addToCart} />}
        {activeTab === 'hotels' && <HotelBooking onAddToCart={addToCart} />}
        {activeTab === 'trains' && <TrainBooking onAddToCart={addToCart} />}
        {activeTab === 'activities' && <ActivityBooking onAddToCart={addToCart} />}
        {activeTab === 'itinerary' && <ItineraryBuilder cart={cart} />}
      </div>

      {/* Shopping Cart Modal */}
      {showCart && (
        <BookingCart
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          user={user}
        />
      )}
    </div>
  );
}
