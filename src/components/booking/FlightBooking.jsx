'use client';
import { useState } from 'react';

export default function FlightBooking({ onAddToCart }) {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tripType, setTripType] = useState('roundtrip');

  const popularDestinations = [
    { code: 'NYC', name: 'New York', country: 'USA', price: 299 },
    { code: 'LON', name: 'London', country: 'UK', price: 399 },
    { code: 'PAR', name: 'Paris', country: 'France', price: 449 },
    { code: 'TOK', name: 'Tokyo', country: 'Japan', price: 599 },
    { code: 'DUB', name: 'Dubai', country: 'UAE', price: 349 },
    { code: 'BKK', name: 'Bangkok', country: 'Thailand', price: 279 }
  ];

  const mockFlights = [
    {
      id: 1,
      airline: 'Air Global',
      from: 'New Delhi',
      to: 'Mumbai',
      departTime: '08:30',
      arriveTime: '10:45',
      duration: '2h 15m',
      price: 129,
      class: 'Economy',
      stops: 'Non-stop'
    },
    {
      id: 2,
      airline: 'SkyWings',
      from: 'New Delhi',
      to: 'Mumbai',
      departTime: '14:20',
      arriveTime: '16:50',
      duration: '2h 30m',
      price: 149,
      class: 'Economy',
      stops: 'Non-stop'
    },
    {
      id: 3,
      airline: 'Premium Air',
      from: 'New Delhi',
      to: 'Mumbai',
      departTime: '19:15',
      arriveTime: '21:35',
      duration: '2h 20m',
      price: 199,
      class: 'Business',
      stops: 'Non-stop'
    }
  ];

  const handleSearch = async () => {
    if (!searchData.from || !searchData.to || !searchData.departDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const params = new URLSearchParams({
        origin: searchData.from,
        destination: searchData.to,
        departureDate: searchData.departDate,
        adults: searchData.passengers.toString()
      });

      if (tripType === 'roundtrip' && searchData.returnDate) {
        params.append('returnDate', searchData.returnDate);
      }

      const response = await fetch(`/api/flights?${params}`);
      const data = await response.json();

      if (response.ok) {
        if (data.fallback) {
          console.warn('Using fallback flight data');
        }
        
        // Transform API response to match our expected format
        const transformedFlights = data.flights.map((flight, index) => ({
          id: flight.id || index + 1,
          airline: flight.airline || 'Unknown Airline',
          from: searchData.from,
          to: searchData.to,
          departTime: flight.departTime || '08:30',
          arriveTime: flight.arriveTime || '10:45',
          duration: flight.duration || '2h 15m',
          price: typeof flight.price === 'object' ? flight.price.total : flight.price || 299,
          class: flight.class || 'Economy',
          stops: flight.stops || 'Non-stop',
          date: searchData.departDate
        }));

        setFlights(transformedFlights);
      } else {
        console.error('Flight search failed:', data.error);
        // Use mock data as fallback
        setFlights(mockFlights.map(flight => ({
          ...flight,
          from: searchData.from,
          to: searchData.to,
          date: searchData.departDate
        })));
      }
    } catch (error) {
      console.error('Flight search error:', error);
      // Use mock data as fallback
      setFlights(mockFlights.map(flight => ({
        ...flight,
        from: searchData.from,
        to: searchData.to,
        date: searchData.departDate
      })));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (flight) => {
    const bookingItem = {
      type: 'flight',
      ...flight,
      passengers: searchData.passengers,
      bookingClass: searchData.class,
      tripType: tripType,
      returnDate: tripType === 'roundtrip' ? searchData.returnDate : null
    };
    onAddToCart(bookingItem);
    alert('Flight added to cart!');
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">✈️</span>
          Search Flights
        </h2>

        {/* Trip Type */}
        <div className="flex space-x-4 mb-6">
          <label className="flex items-center">
            <input
              type="radio"
              value="roundtrip"
              checked={tripType === 'roundtrip'}
              onChange={(e) => setTripType(e.target.value)}
              className="mr-2"
            />
            Round Trip
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="oneway"
              checked={tripType === 'oneway'}
              onChange={(e) => setTripType(e.target.value)}
              className="mr-2"
            />
            One Way
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input
              type="text"
              value={searchData.from}
              onChange={(e) => setSearchData(prev => ({...prev, from: e.target.value}))}
              placeholder="Departure city"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="text"
              value={searchData.to}
              onChange={(e) => setSearchData(prev => ({...prev, to: e.target.value}))}
              placeholder="Destination city"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
            <input
              type="date"
              value={searchData.departDate}
              onChange={(e) => setSearchData(prev => ({...prev, departDate: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {tripType === 'roundtrip' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
              <input
                type="date"
                value={searchData.returnDate}
                onChange={(e) => setSearchData(prev => ({...prev, returnDate: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
            <select
              value={searchData.passengers}
              onChange={(e) => setSearchData(prev => ({...prev, passengers: parseInt(e.target.value)}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1,2,3,4,5,6].map(num => (
                <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={searchData.class}
              onChange={(e) => setSearchData(prev => ({...prev, class: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching Flights...' : 'Search Flights'}
        </button>
      </div>

      {/* Popular Destinations */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Destinations</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((dest) => (
            <div
              key={dest.code}
              onClick={() => setSearchData(prev => ({...prev, to: dest.name}))}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer text-center"
            >
              <div className="text-2xl font-bold text-blue-600">{dest.code}</div>
              <div className="text-sm font-medium text-gray-800">{dest.name}</div>
              <div className="text-xs text-gray-500">{dest.country}</div>
              <div className="text-sm font-bold text-green-600 mt-2">From ${dest.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Flight Results */}
      {flights.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Available Flights</h3>
          <div className="space-y-4">
            {flights.map((flight) => (
              <div key={flight.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-lg font-bold text-gray-800">{flight.airline}</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{flight.stops}</span>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{flight.departTime}</div>
                        <div className="text-sm text-gray-500">{flight.from}</div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="text-sm text-gray-500">{flight.duration}</div>
                        <div className="flex items-center justify-center mt-1">
                          <div className="h-px bg-gray-300 flex-1"></div>
                          <span className="mx-2">✈️</span>
                          <div className="h-px bg-gray-300 flex-1"></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{flight.arriveTime}</div>
                        <div className="text-sm text-gray-500">{flight.to}</div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-8 text-right">
                    <div className="text-3xl font-bold text-green-600">${flight.price}</div>
                    <div className="text-sm text-gray-500 mb-4">{flight.class}</div>
                    <button
                      onClick={() => handleAddToCart(flight)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
