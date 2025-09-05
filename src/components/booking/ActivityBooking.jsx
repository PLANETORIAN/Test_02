'use client';
import { useState } from 'react';

export default function ActivityBooking({ onAddToCart }) {
  const [searchData, setSearchData] = useState({
    destination: '',
    date: '',
    category: 'all',
    participants: 1
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { value: 'all', label: 'All Activities' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'nature', label: 'Nature' },
    { value: 'food', label: 'Food & Drink' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'relaxation', label: 'Relaxation' }
  ];

  const popularActivities = [
    {
      id: 1,
      name: 'Taj Mahal Sunrise Tour',
      location: 'Agra, India',
      category: 'cultural',
      duration: '4 hours',
      price: 45,
      rating: 4.9,
      image: '🕌',
      description: 'Witness the magnificent Taj Mahal at sunrise with skip-the-line access',
      highlights: ['Skip-the-line tickets', 'Professional guide', 'Sunrise viewing', 'Photography tips'],
      difficulty: 'Easy'
    },
    {
      id: 2,
      name: 'Goa Beach Parasailing',
      location: 'Goa, India',
      category: 'adventure',
      duration: '2 hours',
      price: 65,
      rating: 4.7,
      image: '🪂',
      description: 'Soar above the beautiful beaches of Goa with this thrilling parasailing experience',
      highlights: ['Safety equipment included', 'Certified instructor', 'Beach views', 'Photo session'],
      difficulty: 'Medium'
    },
    {
      id: 3,
      name: 'Kerala Backwater Cruise',
      location: 'Kerala, India',
      category: 'nature',
      duration: '6 hours',
      price: 85,
      rating: 4.8,
      image: '🛶',
      description: 'Peaceful cruise through the serene backwaters of Kerala',
      highlights: ['Traditional houseboat', 'Local lunch included', 'Bird watching', 'Village visits'],
      difficulty: 'Easy'
    },
    {
      id: 4,
      name: 'Mumbai Street Food Tour',
      location: 'Mumbai, India',
      category: 'food',
      duration: '3 hours',
      price: 35,
      rating: 4.6,
      image: '🍛',
      description: 'Explore the vibrant street food scene of Mumbai with a local guide',
      highlights: ['8+ food tastings', 'Local guide', 'Market visits', 'Cultural insights'],
      difficulty: 'Easy'
    },
    {
      id: 5,
      name: 'Rajasthan Desert Safari',
      location: 'Rajasthan, India',
      category: 'adventure',
      duration: '8 hours',
      price: 120,
      rating: 4.8,
      image: '🐪',
      description: 'Experience the Thar Desert with camel rides and cultural performances',
      highlights: ['Camel safari', 'Desert camp', 'Traditional dinner', 'Folk performances'],
      difficulty: 'Medium'
    },
    {
      id: 6,
      name: 'Ayurvedic Spa Experience',
      location: 'Kerala, India',
      category: 'relaxation',
      duration: '3 hours',
      price: 95,
      rating: 4.9,
      image: '🧘',
      description: 'Rejuvenate with authentic Ayurvedic treatments and therapies',
      highlights: ['Consultation included', 'Herbal treatments', 'Meditation session', 'Healthy refreshments'],
      difficulty: 'Easy'
    },
    {
      id: 7,
      name: 'Bollywood Dance Class',
      location: 'Mumbai, India',
      category: 'entertainment',
      duration: '2 hours',
      price: 40,
      rating: 4.5,
      image: '💃',
      description: 'Learn classic Bollywood dance moves from professional choreographers',
      highlights: ['Professional instructor', 'Group class', 'Music included', 'Performance video'],
      difficulty: 'Medium'
    },
    {
      id: 8,
      name: 'Himalayan Trekking',
      location: 'Himachal Pradesh, India',
      category: 'adventure',
      duration: 'Full day',
      price: 150,
      rating: 4.7,
      image: '🏔️',
      description: 'Challenging trek through stunning Himalayan landscapes',
      highlights: ['Experienced guide', 'Mountain views', 'Local lunch', 'Certificate'],
      difficulty: 'Hard'
    }
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filteredActivities = popularActivities;
      
      if (searchData.destination) {
        filteredActivities = filteredActivities.filter(activity =>
          activity.location.toLowerCase().includes(searchData.destination.toLowerCase())
        );
      }
      
      if (searchData.category !== 'all') {
        filteredActivities = filteredActivities.filter(activity =>
          activity.category === searchData.category
        );
      }
      
      setActivities(filteredActivities);
      setIsLoading(false);
    }, 1000);
  };

  const handleAddToCart = (activity) => {
    const bookingItem = {
      type: 'activity',
      ...activity,
      date: searchData.date,
      participants: searchData.participants,
      price: activity.price * searchData.participants
    };
    onAddToCart(bookingItem);
    alert('Activity added to cart!');
  };

  const getRating = (rating) => {
    const stars = '⭐'.repeat(Math.floor(rating));
    return `${stars} ${rating}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">🎯</span>
          Search Activities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
            <input
              type="text"
              value={searchData.destination}
              onChange={(e) => setSearchData(prev => ({...prev, destination: e.target.value}))}
              placeholder="City or location"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={searchData.date}
              onChange={(e) => setSearchData(prev => ({...prev, date: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={searchData.category}
              onChange={(e) => setSearchData(prev => ({...prev, category: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
            <select
              value={searchData.participants}
              onChange={(e) => setSearchData(prev => ({...prev, participants: parseInt(e.target.value)}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{num} Participant{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching Activities...' : 'Search Activities'}
        </button>
      </div>

      {/* Activity Results */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {activities.length > 0 ? 'Search Results' : 'Popular Activities'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activities.length > 0 ? activities : popularActivities).map((activity) => (
            <div key={activity.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="text-6xl text-center mb-4">{activity.image}</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{activity.name}</h4>
                <p className="text-gray-600 mb-2">📍 {activity.location}</p>
                <p className="text-sm text-gray-500 mb-4">{activity.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{getRating(activity.rating)}</span>
                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Duration: {activity.duration}</div>
                  <div className="text-sm text-gray-600 mb-2">Highlights:</div>
                  <div className="flex flex-wrap gap-1">
                    {activity.highlights.slice(0, 3).map((highlight, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {highlight}
                      </span>
                    ))}
                    {activity.highlights.length > 3 && (
                      <span className="text-xs text-gray-500">+{activity.highlights.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-green-600">${activity.price}</span>
                    <span className="text-sm text-gray-500">/person</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(activity)}
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
