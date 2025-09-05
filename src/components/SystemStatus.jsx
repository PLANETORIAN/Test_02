'use client';
import { useState, useEffect } from 'react';

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      setStatus({
        overall: 'unavailable',
        message: 'Unable to check system status',
        fallbackMode: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Checking system status...</span>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const getStatusColor = (overall) => {
    switch (overall) {
      case 'healthy': return 'bg-green-100 border-green-300 text-green-800';
      case 'degraded': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'unavailable': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (overall) => {
    switch (overall) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'unavailable': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor(status.overall)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon(status.overall)}</span>
          <span className="font-medium">System Status</span>
        </div>
        <button 
          onClick={fetchStatus}
          className="text-xs opacity-70 hover:opacity-100 transition-opacity"
        >
          Refresh
        </button>
      </div>
      
      <p className="text-sm mb-3">{status.message}</p>
      
      {status.fallbackMode && (
        <div className="bg-white bg-opacity-50 rounded p-2 mb-3">
          <p className="text-xs">
            <strong>Demo Mode:</strong> Some services are temporarily unavailable. 
            You can still explore the app with sample data.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
            status.services.app === 'healthy' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>App</span>
        </div>
        <div className="text-center">
          <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
            status.services.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>Database</span>
        </div>
        <div className="text-center">
          <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
            status.services.amadeus === 'configured' ? 'bg-green-500' : 'bg-yellow-500'
          }`}></div>
          <span>Travel API</span>
        </div>
      </div>
    </div>
  );
}
