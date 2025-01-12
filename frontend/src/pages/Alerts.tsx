import React, { useState, useEffect } from 'react';
import '../assets/css/riskmap.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Ensure your API key is securely stored here
const apiKey = 'd0f371c0dce646bc95b2bbf48ce1e2c2'; // OpenCage API Key

const Alerts = () => {
  const [coordinates, setCoordinates] = useState<any>(null); // User's coordinates
  const [riskData, setRiskData] = useState<any>(null); // Earthquake risk data
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [location, setLocation] = useState<string>(''); // Search location state
  const [suggestions, setSuggestions] = useState<any[]>([]); // Search suggestions
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false); // Loading state for suggestions

  // Function to detect user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error detecting location', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };

  // Fetch earthquake risk data based on coordinates
  const fetchRiskData = async () => {
    if (!coordinates) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${coordinates.lat}&longitude=${coordinates.lng}&maxradiuskm=200`
      );
      setRiskData(response.data.features);
    } catch (error) {
      console.error('Error fetching risk data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch risk data whenever coordinates change
  useEffect(() => {
    if (coordinates) {
      fetchRiskData();
    }
  }, [coordinates]);

  // Fetch user's location when the component mounts
  useEffect(() => {
    getUserLocation();
  }, []);

  const UpdateMapView = () => {
    const map = useMap();
    if (coordinates) {
      map.setView([coordinates.lat, coordinates.lng], 10); // Zoom level 10
    }
    return null;
  };

  // Handle search input change for suggestions
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
    console.log("Search value: ", event.target.value); // Debug log

    // Check if the search term is not empty and is more than one character
    if (event.target.value.trim() === '' || event.target.value.length < 2) {
      setSuggestions([]);
      return; // Don't make the API request if the search term is too short
    }

    setLoadingSuggestions(true);

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${event.target.value}&key=${apiKey}`
      );
      console.log("API Response: ", response.data); // Debug log

      const data = response.data;
      if (data.results && data.results.length > 0) {
        setSuggestions(data.results);
      } else {
        setSuggestions([]); // No results, clear suggestions
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]); // Clear suggestions on error
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Handle suggestion selection (when a suggestion is clicked)
  const handleSuggestionSelect = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    setSuggestions([]); // Clear suggestions after selection
    setLocation(''); // Optionally clear the input field after selection
  };

  // Handle key press (Enter) for searching and fetching risk data
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // When user presses Enter, fetch data based on the location
      if (location.trim() !== '') {
        fetchLocationData(location); // Call a function to fetch data for the entered location
      }
    }
  };

  // Fetch location data (coordinates) for the given location
  const fetchLocationData = async (location: string) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${apiKey}`
      );
      const { results } = response.data;
      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry;
        setCoordinates({ lat, lng });
      } else {
        console.log('No location found');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-black container mx-auto p-6" 
>

      <h1 className='text-4xl font-bold text-center my-8'>Earthquake Risk Map</h1>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={location}
          onChange={handleSearch} // Handle typing for suggestions
          onKeyDown={handleKeyPress} // Handle Enter key to trigger fetch
          placeholder="Search for a location"
          className="w-full p-4 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-lg"
          />
        {loadingSuggestions && <p>Loading suggestions...</p>}

        {suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            {suggestions.map((suggestion: any, index: number) => (
              <li
                key={suggestion.place_id || `${suggestion.formatted}-${index}`} // Ensure unique key
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionSelect(suggestion.geometry.lat, suggestion.geometry.lng)}
              >
                {suggestion.formatted}
              </li>
            ))}
          </ul>
        )}
        {suggestions.length === 0 && !loadingSuggestions && location && (
          <p>No suggestions found.</p> // Fallback message when no suggestions are found
        )}
      </div>

      {loading && <p>Loading risk data...</p>}

      {riskData && (
        <MapContainer
          center={coordinates ? [coordinates.lat, coordinates.lng] : [0, 0]}
          zoom={coordinates ? 10 : 2}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <UpdateMapView />
          {riskData.map((feature: any, index: number) => (
            <Marker
              key={index}
              position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
              icon={L.icon({
                iconUrl: 'https://example.com/earthquake-icon.png', // Customize the icon
                iconSize: [25, 25],
              })}
            >
              <Popup>
                <strong>{feature.properties.title}</strong><br />
                Magnitude: {feature.properties.mag}<br />
                Location: {feature.properties.place}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {!riskData && !loading && <p>No Risk Data Found For This Location.</p>}
    </div>
  );
};

export default Alerts;
