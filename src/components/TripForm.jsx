'use client';

import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import StatusMessage from './StatusMessage';
import DestinationSelector from './DestinationSelector';

export default function TripForm({ onTripAdded }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showDestinationSelector, setShowDestinationSelector] = useState(false);
  const [selectedDestinationData, setSelectedDestinationData] = useState(null);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    purpose: '',
    transportation: '',
    accommodation: '',
    companions: '',
    activities: '',
    notes: ''
  });

  const purposeOptions = [
    'Business', 'Leisure', 'Family Visit', 'Education', 'Medical', 'Religious', 'Other'
  ];

  const transportationOptions = [
    'Car', 'Flight', 'Train', 'Bus', 'Motorcycle', 'Bicycle', 'Walking', 'Boat', 'Other'
  ];

  const accommodationOptions = [
    'Hotel', 'Airbnb/Rental', 'Family/Friends', 'Hostel', 'Camping', 'Resort', 'Motel', 'Other'
  ];

  const handleDestinationSelect = (destination, destinationData) => {
    setFormData(prev => ({
      ...prev,
      destination: destination
    }));
    setSelectedDestinationData(destinationData);
    setShowDestinationSelector(false);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validate dates
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setMessage({ type: 'error', text: 'End date cannot be before start date' });
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Trip added successfully!' });
        setFormData({
          destination: '',
          startDate: '',
          endDate: '',
          purpose: '',
          transportation: '',
          accommodation: '',
          companions: '',
          activities: '',
          notes: ''
        });
        if (onTripAdded) onTripAdded();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add trip' });
      }
    } catch (error) {
      console.error('Trip submission error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Add New Trip</h2>
      </div>

      {message && (
        <StatusMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
          autoClose={message.type === 'success'}
        />
      )}

      {showDestinationSelector ? (
        <div className="mb-8">
          <DestinationSelector 
            onDestinationSelect={handleDestinationSelect}
            selectedDestination={formData.destination}
          />
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowDestinationSelector(false)}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              ← Back to form
            </button>
          </div>
        </div>
      ) : (
        <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2">
            <label htmlFor="destination" className="block text-sm font-semibold text-gray-700 mb-3">
              Destination *
            </label>
            <div className="relative">
              <input
                id="destination"
                name="destination"
                type="text"
                required
                value={formData.destination}
                onChange={handleInputChange}
                onClick={() => !formData.destination && setShowDestinationSelector(true)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-lg cursor-pointer"
                placeholder="Click to select from popular destinations or type manually"
                readOnly={!formData.destination}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowDestinationSelector(true)}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              {formData.destination && (
                <div className="absolute inset-y-0 right-12 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, destination: '' }));
                      setSelectedDestinationData(null);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {selectedDestinationData && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center text-sm text-blue-800">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {selectedDestinationData.iataCode && (
                    <span className="mr-3">Code: {selectedDestinationData.iataCode}</span>
                  )}
                  {selectedDestinationData.timeZoneOffset && (
                    <span>Timezone: {selectedDestinationData.timeZoneOffset}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-3">
              Start Date *
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-3">
              End Date *
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              required
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
              Purpose *
            </label>
            <select
              id="purpose"
              name="purpose"
              required
              value={formData.purpose}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select purpose</option>
              {purposeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="transportation" className="block text-sm font-medium text-gray-700 mb-2">
              Transportation *
            </label>
            <select
              id="transportation"
              name="transportation"
              required
              value={formData.transportation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select transportation</option>
              {transportationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700 mb-2">
              Accommodation
            </label>
            <select
              id="accommodation"
              name="accommodation"
              value={formData.accommodation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select accommodation</option>
              {accommodationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="companions" className="block text-sm font-medium text-gray-700 mb-2">
              Travel Companions
            </label>
            <input
              id="companions"
              name="companions"
              type="text"
              value={formData.companions}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Family (2 adults, 1 child), Solo, Friends (3 people)"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="activities" className="block text-sm font-medium text-gray-700 mb-2">
              Activities & Experiences
            </label>
            <textarea
              id="activities"
              name="activities"
              rows={3}
              value={formData.activities}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Sightseeing, Museums, Hiking, Beach activities..."
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional details about your trip..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-lg transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" color="white" className="mr-3" />
                Adding Trip...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Trip
              </>
            )}
          </button>
        </div>
      </form>
        </>
      )}
    </div>
  );
}
