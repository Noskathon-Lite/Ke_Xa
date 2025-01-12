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
  const [nearestCityData, setNearestCityData] = useState<HealthRisk | null>(null); // Nearest city data
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
        fetchNearestCityData(lat, lng); // Fetch nearest city data
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

      for (const { lat: nearbyLat, lng: nearbyLng, cityName } of coordinatesWithinRadius) {
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
          cityName: cityName,
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
            cityName: cityName,
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

  // Fetch the nearest city's AQI and outbreak details
  const fetchNearestCityData = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const cityResponse = await axios.get(
        `httpsapi.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${airQualityApiKey}`
      );
      const city = cityResponse.data.name; // Get nearest city name
      // Fetch AQI data for the nearest city
      const aqiResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${airQualityApiKey}`
      );
      const aqiData = aqiResponse.data.list[0].components;
      const aqiLevel = determineAQILevel(aqiData.pm2_5);

      // Fetch Disease Outbreak Data
      const outbreakResponse = await axios.get(`https://disease.sh/v3/covid-19/countries`);
      const outbreakData = outbreakResponse.data.find((country: any) => country.countryInfo.lat === lat && country.countryInfo.long === lng);

      setNearestCityData({
        id: `${city}-aqi`,
        type: 'air',
        level: aqiLevel,
        location: { lat, lng },
        cityName: city,
        description: `Air quality index (PM2.5): ${aqiData.pm2_5} in ${city}`,
        recommendations: getHealthRecommendations(aqiLevel),
      });
    } catch (error) {
      setError('Error fetching nearest city data.');
    } finally {
      setLoading(false);
    }
  };

  // Get nearby coordinates (simplified approach, assumes nearby locations are within the 100 km radius)
  const getNearbyCoordinates = (lat: number, lng: number) => {
    const nearbyCoordinates = [];
    const radius = 0.1; // Roughly 100 km in latitude/longitude

    let counter = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        counter++;
        nearbyCoordinates.push({
          lat: lat + i * radius + Math.sin(counter) * 0.1, // Add slight zigzag movement
          lng: lng + j * radius + Math.cos(counter) * 0.1, // Add slight zigzag movement
          cityName: `City ${counter}`, // Use a placeholder name for this example
        });
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
          'Avoid Outdoor Activities If Sensitive To Pollution',
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
          fetchNearestCityData(latitude, longitude); // Fetch nearest city data
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
    if (location) {
      fetchCoordinates(location);
    }
  };

  const UpdateMapView = () => {
    const map = useMap();
    if (coordinates) {
      map.flyTo([coordinates.lat, coordinates.lng], 10);
    }
    return null;
  };

  const getRiskColor = (type: string, level: string) => {
    if (type === 'air') {
      switch (level) {
        case 'high':
          return 'red';
        case 'medium':
          return 'orange';
        default:
          return 'green';
      }
    } else {
      return 'purple';
    }
  };

  return (
    <div className="risk-map">
      <h1>Health Risk Map</h1>
     
      <form onSubmit={handleSearchSubmit} className="flex space-x-2 mb-4">
  <input
    type="text"
    value={location}
    onChange={handleSearchChange}
    placeholder="Enter a location"
    className="w-full sm:w-72 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    type="submit"
    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    Search
  </button>
</form>

      <div className="map-container">
        <MapContainer center={[27.7172, 85.3240]} zoom={10} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }}>
          <UpdateMapView />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Nearest City Data */}
          {nearestCityData && (
            <CircleMarker
              key={nearestCityData.id}
              center={nearestCityData.location}
              radius={12}
              color={getRiskColor(nearestCityData.type, nearestCityData.level)}
              fillOpacity={0.6}
            >
              <Popup>
                <strong>City Name:</strong> {nearestCityData.cityName}<br />
                <strong>Location:</strong> {nearestCityData.location.lat.toFixed(4)}, {nearestCityData.location.lng.toFixed(4)}<br />
                <strong>Risk Type:</strong> {nearestCityData.type === 'air' ? 'AQI' : 'Outbreak'}<br />
                <strong>Level:</strong> {nearestCityData.level}<br />
                <strong>Description:</strong> {nearestCityData.description}<br />
                <strong>Precautions:</strong>
                <ul>
                  {nearestCityData.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </Popup>
            </CircleMarker>
          )}

          {/* Health Risk Data for 100 km radius */}
          {healthRiskData.map((risk) => (
            <CircleMarker
              key={risk.id}
              center={risk.location}
              radius={12}
              color={getRiskColor(risk.type, risk.level)}
              fillOpacity={0.6}
            >
              <Popup>
                <strong>City Name:</strong> {risk.cityName}<br />
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
  );
};

export default RiskMap;
