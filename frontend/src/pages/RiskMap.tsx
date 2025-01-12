import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HealthRisk } from '../types';

const mockRisks: HealthRisk[] = [
  {
    id: '1',
    type: 'air',
    level: 'high',
    location: { lat: 34.0522, lng: -118.2437 },
    description: 'High air pollution levels detected',
    recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside'],
  },
  {
    id: '2',
    type: 'disease',
    level: 'medium',
    location: { lat: 34.0622, lng: -118.2537 },
    description: 'Increased flu cases reported',
    recommendations: ['Practice social distancing', 'Get vaccinated'],
  },
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Risk Heat Map</h2>
        <div className="h-[600px] rounded-lg overflow-hidden">
          <MapContainer
            center={[34.0522, -118.2437]}
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
                    <h3 className="font-semibold">{risk.description}</h3>
                    <ul className="mt-2 text-sm">
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Air Quality</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Poor - Take precautions</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Disease Outbreaks</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Moderate risk - Stay alert</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Water Quality</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Good - Safe to use</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;