'use client';
import { useState } from 'react';

export default function HotelBooking({ onAddToCart }) {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const popularHotels = [
    {
      id: 1,
      name: 'Grand Palace Hotel',
      location: 'Mumbai, India',
      rating: 4.8,
      price: 89,
      image: '🏨',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
      description: 'Luxury hotel in the heart of the city'
    },
    {
      id: 2,
      name: 'Ocean View Resort',
      location: 'Goa, India',
      rating: 4.6,
      price: 129,
      image: '🏖️',
      amenities: ['Beach Access', 'WiFi', 'Pool', 'Bar'],
      description: 'Beachfront resort with stunning ocean views'
    },
    {
      id: 3,
      name: 'Mountain Lodge',
      location: 'Manali, India',
      rating: 4.4,
      price: 79,
      image: '🏔️',
      amenities: ['Mountain View', 'WiFi', 'Fireplace', 'Restaurant'],
      description: 'Cozy lodge surrounded by mountains'
    },
    {
      id: 4,
      name: 'Business Hotel Central',
      location: 'Delhi, India',
      rating: 4.5,
      price: 99,
      image: '🏢',
      amenities: ['Business Center', 'WiFi', 'Gym', 'Restaurant'],
      description: 'Modern business hotel in commercial district'
    },
    {
      id: 5,
      name: 'Heritage Palace',
      location: 'Rajasthan, India',
      rating: 4.9,
      price: 199,
      image: '🏰',
      amenities: ['Heritage Site', 'WiFi', 'Spa', 'Cultural Tours'],
      description: 'Royal palace converted into luxury hotel'
    },
    {
      id: 6,
      name: 'Backpacker Hostel',
      location: 'Bangalore, India',
      rating: 4.2,
      price: 29,
      image: '🎒',
      amenities: ['Shared Kitchen', 'WiFi', 'Common Area', 'Laundry'],
      description: 'Budget-friendly hostel for backpackers'
    }
  ];

  const handleSearch = async () => {
    if (!searchData.destination || !searchData.checkIn || !searchData.checkOut) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setHotels(popularHotels.filter(hotel => 
        hotel.location.toLowerCase().includes(searchData.destination.toLowerCase()) ||
        searchData.destination === ''
      ));
      setIsLoading(false);
    }, 1500);
  };

  const handleAddToCart = (hotel) => {
    const nights = Math.ceil((new Date(searchData.checkOut) - new Date(searchData.checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = hotel.price * nights * searchData.rooms;
    
    const bookingItem = {
      type: 'hotel',
      ...hotel,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests,
      rooms: searchData.rooms,
      nights: nights,
      price: totalPrice
    };
    onAddToCart(bookingItem);
    alert('Hotel added to cart!');
  };

  const getRating = (rating) => {
    const stars = '⭐'.repeat(Math.floor(rating));
    return `${stars} ${rating}`;
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">🏨</span>
          Search Hotels
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
            <input
              type="text"
              value={searchData.destination}
              onChange={(e) => setSearchData(prev => ({...prev, destination: e.target.value}))}
              placeholder="City or hotel name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
            <input
              type="date"
              value={searchData.checkIn}
              onChange={(e) => setSearchData(prev => ({...prev, checkIn: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
            <input
              type="date"
              value={searchData.checkOut}
              onChange={(e) => setSearchData(prev => ({...prev, checkOut: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
            <select
              value={searchData.guests}
              onChange={(e) => setSearchData(prev => ({...prev, guests: parseInt(e.target.value)}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1,2,3,4,5,6].map(num => (
                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
            <select
              value={searchData.rooms}
              onChange={(e) => setSearchData(prev => ({...prev, rooms: parseInt(e.target.value)}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching Hotels...' : 'Search Hotels'}
        </button>
      </div>

      {/* Hotel Results */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {hotels.length > 0 ? 'Search Results' : 'Popular Hotels'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(hotels.length > 0 ? hotels : popularHotels).map((hotel) => (
            <div key={hotel.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="text-6xl text-center mb-4">{hotel.image}</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{hotel.name}</h4>
                <p className="text-gray-600 mb-2">📍 {hotel.location}</p>
                <p className="text-sm text-gray-500 mb-4">{hotel.description}</p>
                
                <div className="flex items-center mb-4">
                  <span className="text-sm">{getRating(hotel.rating)}</span>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Amenities:</div>
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-green-600">${hotel.price}</span>
                    <span className="text-sm text-gray-500">/night</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(hotel)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
