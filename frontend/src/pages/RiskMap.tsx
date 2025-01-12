import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet'; // <-- Import useMap here
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

  // Fetch the health risk data (AQI, air pollution, etc.) for a 100 km radius
  const fetchHealthRiskData = async (lat: number, lng: number) => {
    setLoading(true);
    setHealthRiskData([]); // Clear previous health risk data
    try {
      // Fetch AQI data for a 100 km radius (simplified approach for now)
      const coordinatesWithinRadius = getNearbyCoordinates(lat, lng);

      const newHealthRiskData: HealthRisk[] = [];

      for (const { lat: nearbyLat, lng: nearbyLng } of coordinatesWithinRadius) {
        const aqiResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${nearbyLat}&lon=${nearbyLng}&appid=${airQualityApiKey}`
        );

        const aqiData = aqiResponse.data.list[0].components;
        const aqiLevel = determineAQILevel(aqiData.pm2_5);

        newHealthRiskData.push({
          id: `${nearbyLat}-${nearbyLng}`,
          type: 'air',
          level: aqiLevel,
          location: { lat: nearbyLat, lng: nearbyLng },
          description: `Air quality index (PM2.5): ${aqiData.pm2_5}`,
          recommendations: getHealthRecommendations(aqiLevel),
        });
      }

      setHealthRiskData(newHealthRiskData);
    } catch (error) {
      setError('Error fetching health risk data.');
    } finally {
      setLoading(false);
    }
  };

  // Get nearby coordinates (simplified approach, assumes nearby locations are within the 100 km radius)
  const getNearbyCoordinates = (lat: number, lng: number) => {
    const nearbyCoordinates = [];
    const radius = 0.9; // Roughly 100 km in latitude/longitude

    // Example nearby locations (to be expanded based on actual needs)
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        nearbyCoordinates.push({ lat: lat + i * radius, lng: lng + j * radius });
      }
    }

    return nearbyCoordinates;
  };

  // Determine the AQI level based on PM2.5 data
  const determineAQILevel = (pm25: number) => {
    if (pm25 > 35) return 'high';
    if (pm25 > 12) return 'medium';
    return 'low';
  };

  // Get health recommendations based on AQI level
  const getHealthRecommendations = (level: string) => {
    switch (level) {
      case 'high':
        return [
          'Avoid outdoor activities if sensitive to pollution',
          'Wear an N95 mask if necessary',
        ];
      case 'medium':
        return [
          'Limit outdoor activities if sensitive to pollution',
          'Take breaks indoors regularly',
        ];
      case 'low':
        return ['Enjoy outdoor activities freely'];
      default:
        return [];
    }
  };

  // Get the user's current location using the Geolocation API
  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          fetchHealthRiskData(latitude, longitude); // Fetch health risk data based on user's location
        },
        (error) => {
          setError('Error fetching user location.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  // Call getUserLocation when the component mounts
  useEffect(() => {
    getUserLocation();
  }, []);

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

  // Update the map view whenever coordinates change
  const UpdateMapView = () => {
    const map = useMap();
    if (coordinates) {
      map.setView([coordinates.lat, coordinates.lng], 10); // Zoom level 10
    }
    return null;
  };

  // Function to get the color based on risk level
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'blue'; // default color
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
            zoom={coordinates ? 10 : 13} // Set zoom to 10 for user location or search location
            className="h-full w-full"
            whenCreated={map => {
              // This ensures the map is updated with the initial user location when the map is created
              if (coordinates) {
                map.setView([coordinates.lat, coordinates.lng], 10);
              }
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Update the map view based on the coordinates */}
            <UpdateMapView />

            {healthRiskData.map((risk) => (
              <Circle
                key={risk.id}
                center={[risk.location.lat, risk.location.lng]}
                radius={500}
                pathOptions={{
                  color: getRiskColor(risk.level),
                  fillColor: getRiskColor(risk.level),
                  fillOpacity: 0.3,
                }}
              >
                <Popup>
                  <h3 className="text-lg font-semibold">{`Risk Level: ${risk.level}`}</h3>
                  <p>{risk.description}</p>
                  <ul>
                    {risk.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
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
