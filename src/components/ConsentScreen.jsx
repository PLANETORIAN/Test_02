'use client';

import { useState } from 'react';
import StatusMessage from './StatusMessage';

export default function ConsentScreen({ onConsent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleConsent = async (consent) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ consent })
      });

      const data = await response.json();

      if (response.ok) {
        if (consent) {
          setMessage({ type: 'success', text: 'Thank you for your consent!' });
          setTimeout(() => onConsent(true), 1500);
        } else {
          setMessage({ type: 'info', text: 'You have declined data collection.' });
          setTimeout(() => onConsent(false), 1500);
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save consent' });
      }
    } catch (error) {
      console.error('Consent error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              NATPAC Travel Data Collection
            </h1>
            <p className="text-xl text-gray-600">
              Help us understand your travel patterns
            </p>
          </div>

          {message && (
            <StatusMessage
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
              autoClose={message.type === 'success'}
            />
          )}

          <div className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Data Collection Consent
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  We would like to collect information about your travel experiences to help improve 
                  transportation and tourism services. This data will be used for research purposes only.
                </p>
                
                <h3 className="font-semibold text-gray-900">What data we collect:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Trip destinations and dates</li>
                  <li>Transportation methods used</li>
                  <li>Accommodation types</li>
                  <li>Travel companions information</li>
                  <li>Trip purpose and activities</li>
                </ul>

                <h3 className="font-semibold text-gray-900">How we use your data:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Analyze travel patterns and trends</li>
                  <li>Improve transportation infrastructure</li>
                  <li>Enhance tourism services</li>
                  <li>Create statistical reports (anonymized)</li>
                </ul>

                <h3 className="font-semibold text-gray-900">Your rights:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>You can withdraw consent at any time</li>
                  <li>Your data will be kept secure and confidential</li>
                  <li>Data will not be shared with third parties</li>
                  <li>You can request deletion of your data</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <button
                onClick={() => handleConsent(true)}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" color="white" className="mr-2" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    I Consent to Data Collection
                  </div>
                )}
              </button>
              
              <button
                onClick={() => handleConsent(false)}
                disabled={isLoading}
                className="flex-1 bg-gray-300 text-gray-700 py-4 px-8 rounded-xl font-semibold hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" color="gray" className="mr-2" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    I Decline
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
