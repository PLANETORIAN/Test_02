'use client';
import { useState } from 'react';

export default function TrainBooking({ onAddToCart }) {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
    class: 'sleeper'
  });
  const [trains, setTrains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const popularRoutes = [
    { from: 'New Delhi', to: 'Mumbai', duration: '16h 20m', price: 45 },
    { from: 'Mumbai', to: 'Bangalore', duration: '24h 10m', price: 55 },
    { from: 'Delhi', to: 'Kolkata', duration: '17h 05m', price: 42 },
    { from: 'Chennai', to: 'Bangalore', duration: '4h 45m', price: 28 },
    { from: 'Mumbai', to: 'Pune', duration: '3h 15m', price: 22 },
    { from: 'Delhi', to: 'Jaipur', duration: '4h 30m', price: 25 }
  ];

  const mockTrains = [
    {
      id: 1,
      name: 'Rajdhani Express',
      number: '12951',
      from: 'New Delhi',
      to: 'Mumbai',
      departTime: '16:55',
      arriveTime: '08:35+1',
      duration: '15h 40m',
      classes: {
        'ac-first': { available: 5, price: 189 },
        'ac-2tier': { available: 12, price: 129 },
        'ac-3tier': { available: 24, price: 89 },
        'sleeper': { available: 45, price: 45 }
      },
      features: ['Meals Included', 'AC', 'Premium Service']
    },
    {
      id: 2,
      name: 'Shatabdi Express',
      number: '12009',
      from: 'New Delhi',
      to: 'Mumbai',
      departTime: '06:00',
      arriveTime: '20:25',
      duration: '14h 25m',
      classes: {
        'ac-chair': { available: 18, price: 95 },
        'exec-chair': { available: 8, price: 145 }
      },
      features: ['Day Train', 'Meals Included', 'AC']
    },
    {
      id: 3,
      name: 'Duronto Express',
      number: '12263',
      from: 'New Delhi',
      to: 'Mumbai',
      departTime: '22:15',
      arriveTime: '12:40+1',
      duration: '14h 25m',
      classes: {
        'ac-2tier': { available: 8, price: 135 },
        'ac-3tier': { available: 20, price: 95 },
        'sleeper': { available: 38, price: 48 }
      },
      features: ['Non-stop', 'AC', 'Fast Service']
    }
  ];

  const classOptions = [
    { value: 'sleeper', label: 'Sleeper (SL)' },
    { value: 'ac-3tier', label: '3rd AC (3A)' },
    { value: 'ac-2tier', label: '2nd AC (2A)' },
    { value: 'ac-first', label: '1st AC (1A)' },
    { value: 'ac-chair', label: 'AC Chair Car (CC)' },
    { value: 'exec-chair', label: 'Executive Chair (EC)' }
  ];

  const handleSearch = async () => {
    if (!searchData.from || !searchData.to || !searchData.date) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTrains(mockTrains.map(train => ({
        ...train,
        from: searchData.from,
        to: searchData.to,
        date: searchData.date
      })));
      setIsLoading(false);
    }, 1500);
  };

  const handleAddToCart = (train, selectedClass) => {
    const classInfo = train.classes[selectedClass];
    if (!classInfo || classInfo.available === 0) {
      alert('This class is not available');
      return;
    }

    const bookingItem = {
      type: 'train',
      name: train.name,
      number: train.number,
      from: train.from,
      to: train.to,
      date: searchData.date,
      departTime: train.departTime,
      arriveTime: train.arriveTime,
      duration: train.duration,
      class: selectedClass,
      passengers: searchData.passengers,
      price: classInfo.price * searchData.passengers,
      features: train.features
    };
    onAddToCart(bookingItem);
    alert('Train ticket added to cart!');
  };

  const getClassLabel = (classValue) => {
    const option = classOptions.find(opt => opt.value === classValue);
    return option ? option.label : classValue;
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">🚄</span>
          Search Trains
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input
              type="text"
              value={searchData.from}
              onChange={(e) => setSearchData(prev => ({...prev, from: e.target.value}))}
              placeholder="Departure station"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="text"
              value={searchData.to}
              onChange={(e) => setSearchData(prev => ({...prev, to: e.target.value}))}
              placeholder="Destination station"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Journey Date</label>
            <input
              type="date"
              value={searchData.date}
              onChange={(e) => setSearchData(prev => ({...prev, date: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
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
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching Trains...' : 'Search Trains'}
        </button>
      </div>

      {/* Popular Routes */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Routes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularRoutes.map((route, index) => (
            <div
              key={index}
              onClick={() => setSearchData(prev => ({...prev, from: route.from, to: route.to}))}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="font-medium text-gray-800">{route.from} → {route.to}</div>
              <div className="text-sm text-gray-500 mt-1">{route.duration}</div>
              <div className="text-sm font-bold text-green-600 mt-2">From ₹{route.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Train Results */}
      {trains.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Available Trains</h3>
          <div className="space-y-6">
            {trains.map((train) => (
              <div key={train.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{train.name}</h4>
                    <p className="text-gray-600">#{train.number}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {train.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-8 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{train.departTime}</div>
                    <div className="text-sm text-gray-500">{train.from}</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm text-gray-500">{train.duration}</div>
                    <div className="flex items-center justify-center mt-1">
                      <div className="h-px bg-gray-300 flex-1"></div>
                      <span className="mx-2">🚄</span>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{train.arriveTime}</div>
                    <div className="text-sm text-gray-500">{train.to}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(train.classes).map(([classType, classInfo]) => (
                    <div
                      key={classType}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors duration-300"
                    >
                      <div className="text-sm font-medium text-gray-800 mb-2">
                        {getClassLabel(classType)}
                      </div>
                      <div className="text-xl font-bold text-green-600 mb-2">
                        ₹{classInfo.price}
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        {classInfo.available > 0 ? `${classInfo.available} seats available` : 'Sold out'}
                      </div>
                      <button
                        onClick={() => handleAddToCart(train, classType)}
                        disabled={classInfo.available === 0}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {classInfo.available > 0 ? 'Book Now' : 'Sold Out'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
