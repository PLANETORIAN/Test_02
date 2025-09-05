'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import StatusMessage from './StatusMessage';

export default function TripTimeline({ refreshTrigger }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trips', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setTrips(data.trips || []);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch trips' });
      }
    } catch (error) {
      console.error('Fetch trips error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [refreshTrigger]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? '1 day' : `${diffDays + 1} days`;
  };

  const getTimelineColor = (purpose) => {
    const colors = {
      'Business': 'bg-blue-500',
      'Leisure': 'bg-green-500',
      'Family Visit': 'bg-purple-500',
      'Education': 'bg-yellow-500',
      'Medical': 'bg-red-500',
      'Religious': 'bg-indigo-500',
      'Other': 'bg-gray-500'
    };
    return colors[purpose] || 'bg-gray-500';
  };

  const getPurposeColor = (purpose) => {
    const colors = {
      'Business': 'bg-blue-100 text-blue-800',
      'Leisure': 'bg-green-100 text-green-800',
      'Family Visit': 'bg-purple-100 text-purple-800',
      'Education': 'bg-yellow-100 text-yellow-800',
      'Medical': 'bg-red-100 text-red-800',
      'Religious': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[purpose] || 'bg-gray-100 text-gray-800';
  };

  const getPurposeIcon = (purpose) => {
    const icons = {
      'Business': '💼 ',
      'Leisure': '🏖️ ',
      'Family Visit': '👨‍👩‍👧‍👦 ',
      'Education': '🎓 ',
      'Medical': '🏥 ',
      'Religious': '🙏 ',
      'Other': '✈️ '
    };
    return icons[purpose] || '✈️ ';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Travel Timeline</h2>
        </div>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Travel Timeline</h2>
        </div>
        {trips.length > 0 && (
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {trips.length} trip{trips.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {message && (
        <StatusMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
          autoClose={true}
        />
      )}

      {trips.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-6">
            <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No trips yet</h3>
          <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">Add your first trip to start building your travel timeline and track your adventures!</p>
          <div className="inline-flex items-center text-blue-600 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Click "Add Trip" to get started
          </div>
        </div>
      ) : (
        <div className="space-y-8">{trips.map((trip, index) => (
            <div key={trip._id} className="relative group">
              {/* Timeline line */}
              {index !== trips.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-gray-300 to-gray-200"></div>
              )}
              
              {/* Timeline node */}
              <div className={`absolute left-3 top-4 w-6 h-6 rounded-full ${getTimelineColor(trip.purpose)} border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-200`}></div>
              
              {/* Trip card */}
              <div className="ml-16 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">{trip.destination}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPurposeColor(trip.purpose)}`}>
                      {getPurposeIcon(trip.purpose)}
                      {trip.purpose}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Dates:</span> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Duration:</span> {calculateDuration(trip.startDate, trip.endDate)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Transportation:</span> {trip.transportation}
                    </p>
                    {trip.accommodation && (
                      <p className="text-gray-600">
                        <span className="font-medium">Accommodation:</span> {trip.accommodation}
                      </p>
                    )}
                  </div>
                </div>
                
                {trip.companions && (
                  <p className="text-gray-600 text-sm mt-2">
                    <span className="font-medium">Companions:</span> {trip.companions}
                  </p>
                )}
                
                {trip.activities && (
                  <p className="text-gray-600 text-sm mt-2">
                    <span className="font-medium">Activities:</span> {trip.activities}
                  </p>
                )}
                
                {trip.notes && (
                  <p className="text-gray-600 text-sm mt-2">
                    <span className="font-medium">Notes:</span> {trip.notes}
                  </p>
                )}
                
                <p className="text-xs text-gray-400 mt-3">
                  Added on {formatDate(trip.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
