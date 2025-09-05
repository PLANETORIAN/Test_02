'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import StatusMessage from './StatusMessage';

export default function DestinationSelector({ onDestinationSelect, selectedDestination = null }) {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Predefined popular destinations with additional info
  const popularDestinations = [
    {
      name: 'Paris',
      iataCode: 'PAR',
      address: { countryCode: 'FR', countryName: 'France' },
      geoCode: { latitude: 48.8566, longitude: 2.3522 },
      subType: 'CITY',
      detailedName: 'Paris, France',
      timeZoneOffset: '+01:00'
    },
    {
      name: 'London',
      iataCode: 'LON',
      address: { countryCode: 'GB', countryName: 'United Kingdom' },
      geoCode: { latitude: 51.5074, longitude: -0.1278 },
      subType: 'CITY',
      detailedName: 'London, United Kingdom',
      timeZoneOffset: '+00:00'
    },
    {
      name: 'New York',
      iataCode: 'NYC',
      address: { countryCode: 'US', countryName: 'United States' },
      geoCode: { latitude: 40.7128, longitude: -74.0060 },
      subType: 'CITY',
      detailedName: 'New York, United States',
      timeZoneOffset: '-05:00'
    },
    {
      name: 'Tokyo',
      iataCode: 'TYO',
      address: { countryCode: 'JP', countryName: 'Japan' },
      geoCode: { latitude: 35.6762, longitude: 139.6503 },
      subType: 'CITY',
      detailedName: 'Tokyo, Japan',
      timeZoneOffset: '+09:00'
    },
    {
      name: 'Dubai',
      iataCode: 'DXB',
      address: { countryCode: 'AE', countryName: 'United Arab Emirates' },
      geoCode: { latitude: 25.2048, longitude: 55.2708 },
      subType: 'CITY',
      detailedName: 'Dubai, United Arab Emirates',
      timeZoneOffset: '+04:00'
    },
    {
      name: 'Singapore',
      iataCode: 'SIN',
      address: { countryCode: 'SG', countryName: 'Singapore' },
      geoCode: { latitude: 1.3521, longitude: 103.8198 },
      subType: 'CITY',
      detailedName: 'Singapore',
      timeZoneOffset: '+08:00'
    },
    {
      name: 'Barcelona',
      iataCode: 'BCN',
      address: { countryCode: 'ES', countryName: 'Spain' },
      geoCode: { latitude: 41.3851, longitude: 2.1734 },
      subType: 'CITY',
      detailedName: 'Barcelona, Spain',
      timeZoneOffset: '+01:00'
    },
    {
      name: 'Rome',
      iataCode: 'ROM',
      address: { countryCode: 'IT', countryName: 'Italy' },
      geoCode: { latitude: 41.9028, longitude: 12.4964 },
      subType: 'CITY',
      detailedName: 'Rome, Italy',
      timeZoneOffset: '+01:00'
    },
    {
      name: 'Mumbai',
      iataCode: 'BOM',
      address: { countryCode: 'IN', countryName: 'India' },
      geoCode: { latitude: 19.0760, longitude: 72.8777 },
      subType: 'CITY',
      detailedName: 'Mumbai, India',
      timeZoneOffset: '+05:30'
    },
    {
      name: 'Delhi',
      iataCode: 'DEL',
      address: { countryCode: 'IN', countryName: 'India' },
      geoCode: { latitude: 28.7041, longitude: 77.1025 },
      subType: 'CITY',
      detailedName: 'Delhi, India',
      timeZoneOffset: '+05:30'
    },
    {
      name: 'Bangkok',
      iataCode: 'BKK',
      address: { countryCode: 'TH', countryName: 'Thailand' },
      geoCode: { latitude: 13.7563, longitude: 100.5018 },
      subType: 'CITY',
      detailedName: 'Bangkok, Thailand',
      timeZoneOffset: '+07:00'
    },
    {
      name: 'Sydney',
      iataCode: 'SYD',
      address: { countryCode: 'AU', countryName: 'Australia' },
      geoCode: { latitude: -33.8688, longitude: 151.2093 },
      subType: 'CITY',
      detailedName: 'Sydney, Australia',
      timeZoneOffset: '+10:00'
    }
  ];

  useEffect(() => {
    // Load popular destinations immediately
    setDestinations(popularDestinations);
    setFilteredDestinations(popularDestinations);
    setIsLoading(false);
  }, []);

  const searchDestinations = async (keyword) => {
    if (!keyword || keyword.length < 2) {
      setFilteredDestinations(destinations);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/destinations/search?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();

      if (response.ok) {
        setFilteredDestinations(data.destinations || []);
      } else {
        setMessage({ type: 'warning', text: 'Search temporarily unavailable. Showing popular destinations.' });
        // Filter local destinations as fallback
        const filtered = destinations.filter(dest => 
          dest.name.toLowerCase().includes(keyword.toLowerCase()) ||
          dest.detailedName.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredDestinations(filtered);
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage({ type: 'warning', text: 'Search temporarily unavailable. Showing popular destinations.' });
      // Filter local destinations as fallback
      const filtered = destinations.filter(dest => 
        dest.name.toLowerCase().includes(keyword.toLowerCase()) ||
        dest.detailedName.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredDestinations(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce the search
    const timeoutId = setTimeout(() => {
      searchDestinations(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleDestinationSelect = (destination) => {
    const formattedDestination = `${destination.name}, ${destination.address?.countryName || destination.address?.countryCode || ''}`;
    onDestinationSelect(formattedDestination, destination);
  };

  const getCountryFlag = (countryCode) => {
    const flagEmojis = {
      'FR': '🇫🇷', 'GB': '🇬🇧', 'US': '🇺🇸', 'JP': '🇯🇵', 'AE': '🇦🇪',
      'SG': '🇸🇬', 'ES': '🇪🇸', 'IT': '🇮🇹', 'IN': '🇮🇳', 'TH': '🇹🇭',
      'AU': '🇦🇺', 'DE': '🇩🇪', 'NL': '🇳🇱', 'CA': '🇨🇦', 'BR': '🇧🇷'
    };
    return flagEmojis[countryCode] || '🌍';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Destination</h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="h-12 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Select Destination
        </h3>
      </div>

      {message && (
        <StatusMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
          autoClose={true}
        />
      )}

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search destinations..."
            className="w-full px-4 py-4 pl-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isSearching ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredDestinations.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600">No destinations found. Try a different search term.</p>
          </div>
        ) : (
          filteredDestinations.map((destination, index) => (
            <button
              key={`${destination.iataCode || destination.id || index}`}
              onClick={() => handleDestinationSelect(destination)}
              className={`group p-4 border rounded-xl text-left hover:border-purple-300 hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${
                selectedDestination === `${destination.name}, ${destination.address?.countryName || destination.address?.countryCode || ''}` 
                  ? 'border-purple-500 bg-purple-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">
                      {getCountryFlag(destination.address?.countryCode)}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                        {destination.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {destination.address?.countryName || destination.address?.countryCode || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  {destination.iataCode && (
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {destination.iataCode}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="ml-2">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      
      {searchTerm === '' && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ✈️ Showing popular destinations. Start typing to search for more places!
          </p>
        </div>
      )}
    </div>
  );
}
