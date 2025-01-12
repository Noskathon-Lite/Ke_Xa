import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import debounce from "lodash.debounce"; // Use lodash to debounce the API calls
import ClipLoader from "react-spinners/ClipLoader"; // Spinner for loading indicator

// Fix default icon for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const RiskMap = () => {
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number } | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoordinates({ lat: latitude, lon: longitude });
        setMapCenter({ lat: latitude, lon: longitude });
        fetchRiskAlerts(latitude, longitude);
      },
      (error) => {
        console.error("Error fetching location:", error);
        setError("Could not retrieve your location. Please allow location access.");
      }
    );
  }, []);

  // Fetch earthquake alerts from USGS API
  const fetchRiskAlerts = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=200`
      );
      const data = await response.json();
      const alerts = data.features.map((feature: any) => ({
        id: feature.id,
        title: `Earthquake: M${feature.properties.mag}`,
        description: feature.properties.place,
        location: { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] },
      }));
      setAlerts(alerts);
      setError(null);
    } catch (error) {
      console.error("Error fetching risk alerts:", error);
      setError("Failed to fetch earthquake alerts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch for location suggestions
  const fetchSuggestions = debounce(async (query: string) => {
    if (!query.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError("Failed to fetch location suggestions. Please try again later.");
    }
  }, 500); // debounce for 500ms delay

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
  };

  // Handle search result click
  const handleSearchResultClick = async (place: any) => {
    const { lat, lon } = place;
    setMapCenter({ lat: parseFloat(lat), lon: parseFloat(lon) });
    fetchRiskAlerts(parseFloat(lat), parseFloat(lon));
    setSearchQuery(place.display_name);
    setSuggestions([]);
  };

  // Handle search submission
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter({ lat: parseFloat(lat), lon: parseFloat(lon) });
        fetchRiskAlerts(parseFloat(lat), parseFloat(lon));
        setError(null);
      } else {
        setError("Location not found. Please try another search.");
      }
    } catch (error) {
      console.error("Error performing search:", error);
      setError("Failed to perform search. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Risk Heat-Map Visualization</h2>
        <div className="flex space-x-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search for the desired location's heatmap"
            className="border px-4 py-2 rounded-lg w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>
        {/* Suggestions */}
        {suggestions.length > 0 && (
          <ul className="bg-gray-100 border rounded-lg p-3">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                className="cursor-pointer hover:bg-gray-200 p-2"
                onClick={() => handleSearchResultClick(suggestion)}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
        {/* Error Message */}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      {/* Map Section */}
      <div className="h-[500px] relative">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        )}
        {mapCenter && (
          <MapContainer
            center={[mapCenter.lat, mapCenter.lon]}
            zoom={8}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {alerts.map((alert) => (
              <Marker
                key={alert.id}
                position={[alert.location.lat, alert.location.lng]}
              >
                <Popup>
                  <h3>{alert.title}</h3>
                  <p>{alert.description}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default RiskMap;
