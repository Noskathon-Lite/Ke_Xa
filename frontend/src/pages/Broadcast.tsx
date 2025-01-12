import React, { useEffect, useState } from 'react';
import { Radio, Bell, AlertTriangle, Info } from 'lucide-react';

interface Broadcast {
  id: string;
  type: 'emergency' | 'update' | 'advisory';
  title: string;
  message: string;
  timestamp: string;
  area: string;
}

const getBroadcastStyle = (type: Broadcast['type']) => {
  switch (type) {
    case 'emergency':
      return 'bg-red-50 border-red-200';
    case 'update':
      return 'bg-blue-50 border-blue-200';
    case 'advisory':
      return 'bg-yellow-50 border-yellow-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

const Broadcast = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  // Fetch broadcasts from API
  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Replace with your API endpoint
      const response = await fetch('https://mockapi.io/projects/123456789/broadcasts');
      if (!response.ok) {
        throw new Error('Failed to fetch broadcasts');
      }

      const data = await response.json();
      setBroadcasts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Radio className="w-6 h-6 mr-2" />
            Emergency Broadcast System
          </h2>
          <button
            onClick={() => setSubscribed(!subscribed)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              subscribed ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            <Bell className="w-4 h-4 inline-block mr-2" />
            {subscribed ? 'Subscribed' : 'Subscribe to Alerts'}
          </button>
        </div>

        {/* Display Loading State */}
        {loading && <p className="text-gray-700">Loading broadcasts...</p>}

        {/* Display Error State */}
        {error && (
          <p className="text-red-600">
            Error: {error}. Please try refreshing the page.
          </p>
        )}

        {/* Display Broadcasts */}
        <div className="space-y-4">
          {!loading &&
            !error &&
            broadcasts.map((broadcast) => (
              <div
                key={broadcast.id}
                className={`border rounded-lg p-4 ${getBroadcastStyle(broadcast.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      <h3 className="font-semibold">{broadcast.title}</h3>
                    </div>
                    <p className="mt-2 text-sm">{broadcast.message}</p>
                    <div className="mt-3 text-sm">
                      <span className="font-medium">Area: </span>
                      {broadcast.area}
                    </div>
                  </div>
                  <span className="text-xs">
                    {new Date(broadcast.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Stay Informed</h3>
            <p className="text-sm text-blue-800 mt-1">
              Subscribe to receive real-time alerts about emergencies in your area. We'll only send
              you important notifications.
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <Bell className="w-5 h-5 text-green-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900">Notification Settings</h3>
            <p className="text-sm text-green-800 mt-1">
              Customize your alert preferences and choose which types of notifications you want to
              receive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
