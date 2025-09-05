'use client';
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function IntelligentTripBuilder({ onAddToCart, selectedDestination = null }) {
  const [step, setStep] = useState(1);
  const [tripData, setTripData] = useState({
    destination: selectedDestination || '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: 'moderate',
    travelStyle: 'leisure',
    preferences: {
      accommodation: 'hotel',
      transport: 'flight',
      activities: []
    }
  });
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    flights: [],
    hotels: [],
    activities: []
  });

  const budgetOptions = [
    { value: 'budget', label: 'Budget-Friendly', description: 'Under $100/day', icon: '💰' },
    { value: 'moderate', label: 'Moderate', description: '$100-300/day', icon: '💳' },
    { value: 'luxury', label: 'Luxury', description: '$300+/day', icon: '💎' }
  ];

  const travelStyleOptions = [
    { value: 'leisure', label: 'Leisure', description: 'Relaxed pace, comfort', icon: '🏖️' },
    { value: 'adventure', label: 'Adventure', description: 'Active, outdoor activities', icon: '🏔️' },
    { value: 'cultural', label: 'Cultural', description: 'Museums, history, arts', icon: '🏛️' },
    { value: 'business', label: 'Business', description: 'Work-focused, efficient', icon: '💼' }
  ];

  useEffect(() => {
    if (selectedDestination) {
      setTripData(prev => ({ ...prev, destination: selectedDestination }));
    }
  }, [selectedDestination]);

  const handleGenerateRecommendations = async () => {
    if (!tripData.destination || !tripData.startDate || !tripData.endDate) {
      alert('Please fill in destination and dates');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: { name: tripData.destination },
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          travelers: tripData.travelers,
          preferences: {
            budget: tripData.budget,
            travelStyle: tripData.travelStyle
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setRecommendations(result.data);
        setStep(3);
      } else {
        throw new Error(result.error || 'Failed to generate recommendations');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (type, item, selected) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: selected 
        ? [...prev[type], item]
        : prev[type].filter(i => i.id !== item.id)
    }));
  };

  const handleAddSelectedToCart = () => {
    const allItems = [
      ...selectedItems.flights.map(f => ({ ...f, type: 'flight' })),
      ...selectedItems.hotels.map(h => ({ ...h, type: 'hotel' })),
      ...selectedItems.activities.map(a => ({ ...a, type: 'activity' }))
    ];

    allItems.forEach(item => onAddToCart(item));
    alert(`Added ${allItems.length} items to cart!`);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step >= stepNum 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {stepNum}
          </div>
          {stepNum < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h3 className="text-xl font-semibold text-gray-800 mt-4">
            Generating Your Perfect Trip...
          </h3>
          <p className="text-gray-600 mt-2">
            We're analyzing destinations, finding the best flights, hotels, and activities for you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3">🧠</span>
        Intelligent Trip Builder
      </h2>

      {renderStepIndicator()}

      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Trip Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
              <input
                type="text"
                value={tripData.destination}
                onChange={(e) => setTripData(prev => ({...prev, destination: e.target.value}))}
                placeholder="Where do you want to go?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Travelers</label>
              <select
                value={tripData.travelers}
                onChange={(e) => setTripData(prev => ({...prev, travelers: parseInt(e.target.value)}))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1,2,3,4,5,6].map(num => (
                  <option key={num} value={num}>{num} Traveler{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={tripData.startDate}
                onChange={(e) => setTripData(prev => ({...prev, startDate: e.target.value}))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={tripData.endDate}
                onChange={(e) => setTripData(prev => ({...prev, endDate: e.target.value}))}
                min={tripData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!tripData.destination || !tripData.startDate || !tripData.endDate}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Preferences
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Travel Preferences</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Budget Range</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgetOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => setTripData(prev => ({...prev, budget: option.value}))}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    tripData.budget === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Travel Style</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {travelStyleOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => setTripData(prev => ({...prev, travelStyle: option.value}))}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    tripData.travelStyle === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-300"
            >
              Back
            </button>
            <button
              onClick={handleGenerateRecommendations}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Generate Trip Plan
            </button>
          </div>
        </div>
      )}

      {step === 3 && recommendations && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">Your Personalized Trip to {recommendations.destination.name}</h3>
            <p className="text-gray-600">Estimated Budget: ${recommendations.estimatedBudget.total}</p>
          </div>

          {/* Flight Recommendations */}
          {recommendations.flights.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">✈️ Recommended Flights</h4>
              <div className="grid grid-cols-1 gap-4">
                {recommendations.flights.slice(0, 3).map((flight, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{flight.itineraries[0].segments[0].carrierCode} {flight.itineraries[0].segments[0].number}</div>
                        <div className="text-sm text-gray-500">{flight.itineraries[0].duration}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">${flight.price.total}</div>
                        <label className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            onChange={(e) => handleSelectItem('flights', flight, e.target.checked)}
                            className="mr-2"
                          />
                          Select
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hotel Recommendations */}
          {recommendations.hotels.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">🏨 Recommended Hotels</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.hotels.slice(0, 4).map((hotel, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="font-medium">{hotel.hotel.name}</div>
                    <div className="text-sm text-gray-500">{'⭐'.repeat(parseInt(hotel.hotel.rating || 4))}</div>
                    <div className="text-sm text-gray-600 mt-1">{hotel.hotel.description?.text}</div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="font-bold text-green-600">${hotel.offers[0].price.total}/night</div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          onChange={(e) => handleSelectItem('hotels', hotel, e.target.checked)}
                          className="mr-2"
                        />
                        Select
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Recommendations */}
          {recommendations.activities.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">🎯 Recommended Activities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.activities.slice(0, 6).map((activity, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="font-medium">{activity.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{activity.category.replace('_', ' ')}</div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="font-bold text-green-600">$50</div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          onChange={(e) => handleSelectItem('activities', {...activity, price: 50}, e.target.checked)}
                          className="mr-2"
                        />
                        Select
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-300"
            >
              Back to Preferences
            </button>
            <button
              onClick={handleAddSelectedToCart}
              disabled={Object.values(selectedItems).every(items => items.length === 0)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Selected to Cart ({Object.values(selectedItems).flat().length} items)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
