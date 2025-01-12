// import React from 'react';
// import { Bell, AlertTriangle, Info } from 'lucide-react';
// import { Alert } from '../types';

// const mockAlerts: Alert[] = [
//   {
//     id: '1',
//     type: 'earthquake',
//     severity: 'high',
//     title: 'Earthquake Warning',
//     description: 'Magnitude 5.2 earthquake detected 50km north',
//     location: { lat: 34.0522, lng: -118.2437 },
//     timestamp: new Date().toISOString(),
//     instructions: [
//       'Move to open areas',
//       'Stay away from buildings',
//       'Follow emergency protocols'
//     ]
//   },
//   {
//     id: '2',
//     type: 'health',
//     severity: 'medium',
//     title: 'COVID-19 Alert',
//     description: 'Increased cases in your area',
//     location: { lat: 34.0522, lng: -118.2437 },
//     timestamp: new Date().toISOString(),
//     instructions: [
//       'Wear masks in public',
//       'Maintain social distance',
//       'Get tested if symptomatic'
//     ]
//   }
// ];

// const getSeverityColor = (severity: Alert['severity']) => {
//   switch (severity) {
//     case 'high':
//       return 'bg-red-100 text-red-800 border-red-200';
//     case 'medium':
//       return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//     case 'low':
//       return 'bg-green-100 text-green-800 border-green-200';
//     default:
//       return 'bg-gray-100 text-gray-800 border-gray-200';
//   }
// };

// const Alerts = () => {
//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-gray-900 flex items-center">
//             <Bell className="w-6 h-6 mr-2" />
//             Emergency Alerts
//           </h2>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//             Test Alert System
//           </button>
//         </div>

//         <div className="space-y-4">
//           {mockAlerts.map((alert) => (
//             <div
//               key={alert.id}
//               className={`border rounded-lg p-4 ${getSeverityColor(
//                 alert.severity
//               )}`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start space-x-3">
//                   <AlertTriangle className="w-5 h-5 mt-1" />
//                   <div>
//                     <h3 className="font-semibold">{alert.title}</h3>
//                     <p className="text-sm mt-1">{alert.description}</p>
//                     <div className="mt-3">
//                       <h4 className="text-sm font-semibold mb-2">Instructions:</h4>
//                       <ul className="list-disc list-inside text-sm space-y-1">
//                         {alert.instructions.map((instruction, index) => (
//                           <li key={index}>{instruction}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//                 <span className="text-xs">
//                   {new Date(alert.timestamp).toLocaleTimeString()}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
//         <Info className="w-5 h-5 text-blue-500 mt-0.5" />
//         <div>
//           <h3 className="font-semibold text-blue-900">Stay Prepared</h3>
//           <p className="text-sm text-blue-800 mt-1">
//             Enable notifications to receive real-time alerts about emergencies in your area.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Alerts;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, AlertTriangle, Info } from 'lucide-react';
import { Alert } from '../types';

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('https://bipadportal.gov.np/api/v1/alert/');
        const fetchedAlerts = response.data.data.map((alert) => ({
          id: alert.id,
          type: alert.event_type,
          severity: alert.severity.toLowerCase(),
          title: alert.title,
          description: alert.description,
          location: alert.location,
          timestamp: alert.timestamp,
          instructions: alert.instructions || ['No specific instructions provided.'],
        }));
        setAlerts(fetchedAlerts);
      } catch (err) {
        setError('Failed to fetch alerts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading alerts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 mr-2" />
            Emergency Alerts
          </h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Test Alert System
          </button>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 mt-1" />
                  <div>
                    <h3 className="font-semibold">{alert.title}</h3>
                    <p className="text-sm mt-1">{alert.description}</p>
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold mb-2">Instructions:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {alert.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <span className="text-xs">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">Stay Prepared</h3>
          <p className="text-sm text-blue-800 mt-1">
            Enable notifications to receive real-time alerts about emergencies in your area.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
