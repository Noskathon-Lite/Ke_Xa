import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HealthRisk } from '../types';

const mockRisks: HealthRisk[] = [
  {
    id: '1',
    type: 'air',
    level: 'high',
    location: { lat: 27.6960, lng: 85.3451 },
    description: 'High air pollution levels detected',
    recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside'],
  },
  {
    id: '3',
    type: 'disease',
    level: 'high',
    location: { lat: 27.6909, lng: 85.3493 },
    description: 'Increased HMPV Cases detected',
    recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside'],
  },
  {
    id: '4',
    type: 'air',
    level: 'high',
    location: { lat: 27.6787, lng: 85.3237 },
    description: 'High air pollution levels detected',
    recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside'],
  },
  {
    id: '5',
    type: 'water',
    level: 'medium',
    location: { lat: 27.6713, lng: 85.3560 },
    description: 'Water Level Decrease, Drink only after Boiling',
    recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside'],
  },
  {
    id: '2',
    type: 'disease',
    level: 'medium',
    location: { lat: 27.7272, lng: 85.3340 },
    description: 'Increased flu cases reported',
    recommendations: ['Practice social distancing', 'Get vaccinated'],
  }
];

const getRiskColor = (level: HealthRisk['level']) => {
  switch (level) {
    case 'high':
      return '#ef4444';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#10b981';
    default:
      return '#10b981';
  }
};

const RiskMap = () => {
  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900">Health Risk Heat Map</h2>
        <p className="text-gray-600 mt-2">Monitor health risks in your area and take necessary precautions.</p>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-[600px] w-full">
          <MapContainer
            center={[27.678156, 85.34905]} // Kathmandu
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {mockRisks.map((risk) => (
              <Circle
                key={risk.id}
                center={[risk.location.lat, risk.location.lng]}
                radius={500}
                pathOptions={{
                  color: getRiskColor(risk.level),
                  fillColor: getRiskColor(risk.level),
                  fillOpacity: 0.5,
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-lg">{risk.description}</h3>
                    <ul className="mt-2 text-sm text-gray-700">
                      {risk.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">Air Quality</h3>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-gray-700">Poor - Wear Masks & Take precautions</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">Disease Outbreaks</h3>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-gray-700">Moderate risk - Social Distancing - Wear Masks - Stay alert</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">Water Quality</h3>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-700">Good - Safe to use</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;