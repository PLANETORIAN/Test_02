'use client';
import { useState } from 'react';

export default function ItineraryBuilder({ cart }) {
  const [itinerary, setItinerary] = useState({
    title: '',
    startDate: '',
    endDate: '',
    destination: '',
    notes: ''
  });
  const [savedItineraries, setSavedItineraries] = useState([]);

  const groupItemsByDate = () => {
    const grouped = {};
    cart.forEach(item => {
      let date = item.date || item.checkIn || item.departDate || 'No Date';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  const getTotalCost = () => {
    return cart.reduce((total, item) => total + (item.price || 0), 0);
  };

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
        return `${item.from} → ${item.to} at ${item.departTime}`;
      case 'hotel':
        return `${item.name} - ${item.nights} night${item.nights > 1 ? 's' : ''}`;
      case 'train':
        return `${item.name} (${item.number}) - ${item.from} → ${item.to}`;
      case 'activity':
        return `${item.name} - ${item.duration}`;
      default:
        return item.name || 'Unknown item';
    }
  };

  const handleSaveItinerary = () => {
    if (!itinerary.title) {
      alert('Please enter an itinerary title');
      return;
    }

    const newItinerary = {
      id: Date.now(),
      ...itinerary,
      items: [...cart],
      totalCost: getTotalCost(),
      createdAt: new Date().toISOString()
    };

    setSavedItineraries(prev => [...prev, newItinerary]);
    setItinerary({
      title: '',
      startDate: '',
      endDate: '',
      destination: '',
      notes: ''
    });
    alert('Itinerary saved successfully!');
  };

  const handleExportItinerary = () => {
    const itineraryData = {
      ...itinerary,
      items: cart,
      totalCost: getTotalCost(),
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(itineraryData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `itinerary-${itinerary.title || 'unnamed'}.json`;
    link.click();
  };

  const groupedItems = groupItemsByDate();
  const sortedDates = Object.keys(groupedItems).sort();

  return (
    <div className="space-y-8">
      {/* Itinerary Builder Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📋</span>
          Build Your Itinerary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Itinerary Title</label>
            <input
              type="text"
              value={itinerary.title}
              onChange={(e) => setItinerary(prev => ({...prev, title: e.target.value}))}
              placeholder="e.g., Amazing India Adventure"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
            <input
              type="text"
              value={itinerary.destination}
              onChange={(e) => setItinerary(prev => ({...prev, destination: e.target.value}))}
              placeholder="Main destination"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={itinerary.startDate}
              onChange={(e) => setItinerary(prev => ({...prev, startDate: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={itinerary.endDate}
              onChange={(e) => setItinerary(prev => ({...prev, endDate: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={itinerary.notes}
            onChange={(e) => setItinerary(prev => ({...prev, notes: e.target.value}))}
            placeholder="Add any special notes or requirements..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSaveItinerary}
            disabled={cart.length === 0}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Itinerary
          </button>
          <button
            onClick={handleExportItinerary}
            disabled={cart.length === 0}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export Itinerary
          </button>
        </div>
      </div>

      {/* Current Itinerary Preview */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
          <span>📅 Current Itinerary Preview</span>
          <span className="text-2xl font-bold text-green-600">${getTotalCost()}</span>
        </h3>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎒</div>
            <h4 className="text-xl font-semibold text-gray-600 mb-2">No items in your itinerary yet</h4>
            <p className="text-gray-500">Start by adding flights, hotels, trains, or activities to build your perfect trip!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date} className="border-l-4 border-blue-500 pl-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">
                  {date === 'No Date' ? 'Items without specific date' : new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h4>
                <div className="space-y-3">
                  {groupedItems[date].map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{getItemIcon(item.type)}</span>
                        <div>
                          <div className="font-medium text-gray-800">{formatItemDetails(item)}</div>
                          <div className="text-sm text-gray-500 capitalize">{item.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">${item.price}</div>
                        {item.participants && (
                          <div className="text-sm text-gray-500">{item.participants} person{item.participants > 1 ? 's' : ''}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Itineraries */}
      {savedItineraries.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">💾 Saved Itineraries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedItineraries.map((saved) => (
              <div key={saved.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300">
                <h4 className="font-bold text-gray-800 mb-2">{saved.title}</h4>
                <p className="text-sm text-gray-600 mb-2">📍 {saved.destination}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {saved.startDate && saved.endDate ? 
                    `${new Date(saved.startDate).toLocaleDateString()} - ${new Date(saved.endDate).toLocaleDateString()}` :
                    'Dates not specified'
                  }
                </p>
                <p className="text-sm text-gray-500 mb-3">{saved.items.length} items</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-600">${saved.totalCost}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(saved.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
