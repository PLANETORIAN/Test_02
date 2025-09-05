'use client';
import { useState } from 'react';

export default function BookingCart({ cart, onClose, onRemoveItem, totalPrice, user }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: ''
  });

  const getItemIcon = (type) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'hotel': return '🏨';
      case 'train': return '🚄';
      case 'activity': return '🎯';
      default: return '📋';
    }
  };

  const formatItemDetails = (item) => {
    switch (item.type) {
      case 'flight':
        return `${item.from} → ${item.to} on ${item.date}`;
      case 'hotel':
        return `${item.name} (${item.checkIn} to ${item.checkOut})`;
      case 'train':
        return `${item.name} - ${item.from} → ${item.to} on ${item.date}`;
      case 'activity':
        return `${item.name} on ${item.date}`;
      default:
        return item.name || 'Unknown item';
    }
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
      alert('Please fill in all payment details');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save booking to database
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          totalAmount: totalPrice,
          paymentDetails: {
            method: 'card',
            cardLast4: paymentData.cardNumber.slice(-4)
          }
        })
      });

      if (response.ok) {
        const booking = await response.json();
        alert(`Payment successful! Your booking reference is: ${booking.bookingReference}`);
        // Clear cart after successful booking
        cart.forEach(item => onRemoveItem(item.id));
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setShowPayment(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {!showPayment ? (
          /* Cart View */
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">🛒</span>
                Shopping Cart ({cart.length} items)
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some flights, hotels, trains, or activities to get started!</p>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <span className="text-3xl">{getItemIcon(item.type)}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{formatItemDetails(item)}</h4>
                          <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                          {item.participants && (
                            <p className="text-sm text-gray-500">{item.participants} participant{item.participants > 1 ? 's' : ''}</p>
                          )}
                          {item.guests && (
                            <p className="text-sm text-gray-500">{item.guests} guest{item.guests > 1 ? 's' : ''}, {item.rooms} room{item.rooms > 1 ? 's' : ''}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">${item.price}</div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-xl font-bold"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Total: ${totalPrice}</h3>
                      <p className="text-sm text-gray-500">Includes taxes and fees</p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                      >
                        Continue Shopping
                      </button>
                      <button
                        onClick={handleProceedToPayment}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Payment View */
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">💳</span>
                Payment Details
              </h2>
              <button
                onClick={() => setShowPayment(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ← Back to Cart
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Form */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData(prev => ({...prev, cardholderName: e.target.value}))}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData(prev => ({...prev, cardNumber: e.target.value}))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData(prev => ({...prev, expiryDate: e.target.value}))}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData(prev => ({...prev, cvv: e.target.value}))}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
                    <textarea
                      value={paymentData.billingAddress}
                      onChange={(e) => setPaymentData(prev => ({...prev, billingAddress: e.target.value}))}
                      placeholder="123 Main St, City, State, ZIP"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{getItemIcon(item.type)} {formatItemDetails(item)}</span>
                      <span className="font-medium">${item.price}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-green-600">${totalPrice}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </span>
                    ) : (
                      `Pay $${totalPrice} Now`
                    )}
                  </button>
                  
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <span>🔒 Secure Payment</span>
                      <span>💳 All Cards Accepted</span>
                      <span>✅ Instant Confirmation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
