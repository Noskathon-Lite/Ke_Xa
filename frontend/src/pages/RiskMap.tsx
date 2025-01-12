import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { HealthRisk } from '../types';

// API Keys
const openCageApiKey = 'd0f371c0dce646bc95b2bbf48ce1e2c2'; // Get it from https://opencagedata.com/
const airQualityApiKey = '626225c3b337119c4fe0e71e1d5fbf57'; // Get it from https://openweathermap.org/api

const RiskMap = () => {
  const [location, setLocation] = useState<string>(''); // User's search location
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [healthRiskData, setHealthRiskData] = useState<HealthRisk[]>([]); // Health risk data for the location
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Error message

  // Fetch the coordinates of the location entered by the user
  const fetchCoordinates = async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${openCageApiKey}`
      );
      const data = response.data;
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setCoordinates({ lat, lng });
        fetchHealthRiskData(lat, lng); // Fetch health risk data based on the coordinates
      } else {
        setError('Location not found!');
      }
    } catch (error) {
      setError('Error fetching coordinates.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch the health risk data (AQI, air pollution, etc.)
  const fetchHealthRiskData = async (lat: number, lng: number) => {
    setLoading(true);
    setHealthRiskData([]); // Clear previous health risk data
    try {
      // Fetch AQI data using OpenWeatherMap API (free tier)
      const aqiResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${airQualityApiKey}`
      );

      const aqiData = aqiResponse.data.list[0].components;

      const newHealthRiskData: HealthRisk[] = [
        {
          id: '1',
          type: 'air',
          level: aqiData.pm2_5 > 35 ? 'high' : aqiData.pm2_5 > 12 ? 'medium' : 'low',
          location: { lat, lng },
          description: `Air quality index (PM2.5): ${aqiData.pm2_5}`,
          recommendations: [
            'Avoid outdoor activities if sensitive to pollution',
            'Wear an N95 mask if necessary',
          ],
        },
        // You can add more health risk data from different APIs here (e.g., disease alerts, water contamination)
      ];

      setHealthRiskData(newHealthRiskData);
    } catch (error) {
      setError('Error fetching health risk data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle the search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  // Handle the search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchCoordinates(location);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Risk Heat Map</h2>

        <form onSubmit={handleSearchSubmit} className="mb-4">
          <input
            type="text"
            value={location}
            onChange={handleSearchChange}
            placeholder="Enter location"
            className="border border-gray-300 rounded p-2 w-full"
          />
          <button type="submit" className="mt-2 w-full bg-blue-500 text-white py-2 rounded">
            Search
          </button>
        </form>

        {loading && <p>Loading health data...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="h-[600px] rounded-lg overflow-hidden">
          <MapContainer
            center={coordinates ? [coordinates.lat, coordinates.lng] : [27.7008, 85.3000]}
            zoom={coordinates ? 13 : 2}
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

// Helper function to determine the color based on health risk level
const getRiskColor = (level: string) => {
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

export default RiskMap;
