import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HealthRisk } from '../types';

const healthRiskData: HealthRisk[] = [
  {
    id: '1',
    type: 'air',
    level: 'high',
    location: { lat: 27.7008, lng: 85.3000 },
    description: 'High air pollution levels detected',
    recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside'],
  },
  {
    id: '2',
    type: 'disease',
    level: 'medium',
    location: { lat: 27.7108, lng: 85.3100 },
    description: 'Increased flu cases reported',
    recommendations: ['Practice social distancing', 'Get vaccinated'],
  },
  {
    id: '3',
    type: 'water',
    level: 'low',
    location: { lat: 27.7150, lng: 85.3240 },
    description: 'Water quality is safe for use',
    recommendations: ['No precautions necessary'],
  },
  {
    id: '4',
    type: 'air',
    level: 'medium',
    location: { lat: 27.6712, lng: 85.2890 },
    description: 'Moderate air pollution levels detected',
    recommendations: ['Reduce outdoor exposure', 'Wear a mask if sensitive to pollutants'],
  },
  {
    id: '5',
    type: 'disease',
    level: 'high',
    location: { lat: 27.6882, lng: 85.3280 },
    description: 'High number of dengue cases reported',
    recommendations: ['Use mosquito repellent', 'Avoid stagnant water'],
  },
  {
    id: '6',
    type: 'water',
    level: 'medium',
    location: { lat: 27.7030, lng: 85.2880 },
    description: 'Contamination detected in local water supply',
    recommendations: ['Boil water before drinking', 'Use water purifiers'],
  },
  {
    id: '7',
    type: 'air',
    level: 'high',
    location: { lat: 27.6872, lng: 85.3245 },
    description: 'High air pollution levels detected due to traffic',
    recommendations: ['Avoid outdoor activities', 'Wear masks in the area'],
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
            center={[27.7008, 85.3000]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {healthRiskData.map((risk) => (
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
    </div>
  );
};

export default RiskMap;
