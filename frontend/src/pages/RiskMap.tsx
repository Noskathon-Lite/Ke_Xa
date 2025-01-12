import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { HealthRisk } from '../types';

// API Keys
const openCageApiKey = 'd0f371c0dce646bc95b2bbf48ce1e2c2'; // OpenCage API Key
const airQualityApiKey = '626225c3b337119c4fe0e71e1d5fbf57'; // OpenWeather API Key

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

  // Fetch the health risk data (AQI, disease outbreaks, etc.) for a 100 km radius
  const fetchHealthRiskData = async (lat: number, lng: number) => {
    setLoading(true);
    setHealthRiskData([]); // Clear previous health risk data
    try {
      // Fetch AQI data for a 100 km radius (simplified approach for now)
      const coordinatesWithinRadius = getNearbyCoordinates(lat, lng);

      const newHealthRiskData: HealthRisk[] = [];

      for (const { lat: nearbyLat, lng: nearbyLng } of coordinatesWithinRadius) {
        // Fetch AQI Data
        const aqiResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${nearbyLat}&lon=${nearbyLng}&appid=${airQualityApiKey}`
        );
        const aqiData = aqiResponse.data.list[0].components;
        const aqiLevel = determineAQILevel(aqiData.pm2_5);

        newHealthRiskData.push({
          id: `${nearbyLat}-${nearbyLng}-aqi`,
          type: 'air',
          level: aqiLevel,
          location: { lat: nearbyLat, lng: nearbyLng },
          description: `Air quality index (PM2.5): ${aqiData.pm2_5}`,
          recommendations: getHealthRecommendations(aqiLevel),
        });

        // Fetch Disease Outbreak Data (e.g., COVID-19 cases in the nearby region)
        const outbreakResponse = await axios.get(`https://disease.sh/v3/covid-19/countries`);
        const outbreakData = outbreakResponse.data.find((country: any) => country.countryInfo.lat === nearbyLat && country.countryInfo.long === nearbyLng);

        if (outbreakData && outbreakData.cases > 10) { // Minimum of 10 cases
          newHealthRiskData.push({
            id: `${nearbyLat}-${nearbyLng}-outbreak`,
            type: 'outbreak',
            level: 'high', // Example level for outbreak (can add more logic here)
            location: { lat: nearbyLat, lng: nearbyLng },
            description: `Disease Outbreak: ${outbreakData.cases} cases`,
            recommendations: [
              'Follow local health guidelines',
              'Wear a mask and practice social distancing',
            ],
          });
        }
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
    const radius = 0.1; // Roughly 100 km in latitude/longitude

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

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchCoordinates(location);
    }
  };

  const UpdateMapView = () => {
    const map = useMap();
    if (coordinates) {
      map.setView([coordinates.lat, coordinates.lng], 10); // Zoom level 10
    }
    return null;
  };

  // Function to get the color based on risk level for AQI and outbreaks
  const getRiskColor = (type: string, level: string) => {
    if (type === 'air') {
      // Color for AQI
      switch (level) {
        case 'high':
          return 'red';
        case 'medium':
          return 'orange';
        case 'low':
          return 'green';
        default:
          return 'blue'; // Default for AQI
      }
    } else if (type === 'outbreak') {
      // Color for outbreaks
      return 'purple'; // Use purple for outbreaks
    }
    return 'blue';
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
            placeholder="Search for a location"
            className="border px-4 py-2 rounded-md w-full"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 mt-2">
            Search Location
          </button>
        </form>

        <div className="relative w-full h-96">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}

          <MapContainer center={[coordinates?.lat || 0, coordinates?.lng || 0]} zoom={10} style={{ height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <UpdateMapView />

            {healthRiskData.map((risk) => (
              <CircleMarker
                key={risk.id}
                center={risk.location}
                radius={12} // Size of the bubble
                color={getRiskColor(risk.type, risk.level)} // Color based on the risk level
                fillOpacity={0.6}
              >
                <Popup>
                  <strong>Location:</strong> {risk.location.lat.toFixed(4)}, {risk.location.lng.toFixed(4)}<br />
                  <strong>Risk Type:</strong> {risk.type === 'air' ? 'AQI' : 'Outbreak'}<br />
                  <strong>Level:</strong> {risk.level}<br />
                  <strong>Description:</strong> {risk.description}<br />
                  <strong>Precautions:</strong>
                  <ul>
                    {risk.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;
