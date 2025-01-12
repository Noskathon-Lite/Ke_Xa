import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RiskMap from './pages/RiskMap';
import Symptoms from './pages/Symptoms';
import Broadcast from './pages/Broadcast';
import ErrorBoundary from './components/ErrorBoundary';
import { io } from "socket.io-client";

// Type Definitions for Data
interface Alert {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface Ambulance {
  id: number;
  name: string;
  phone: string;
  location: string;
}

interface AlertsProps {
  alerts: Alert[];
}

interface AmbulanceProps {
  ambulances: Ambulance[];
}

const Alerts = ({ alerts }: AlertsProps) => (
  <div>
    <h2>Alerts</h2>
    {alerts.length ? (
      alerts.map(alert => (
        <div key={alert.id}>
          <h3>{alert.title}</h3>
          <p>{alert.description}</p>
          <small>{alert.date}</small>
        </div>
      ))
    ) : (
      <p>No alerts available.</p>
    )}
  </div>
);

const Ambulance = ({ ambulances }: AmbulanceProps) => (
  <div>
    <h2>Nearby Ambulances</h2>
    {ambulances.length ? (
      <ul>
        {ambulances.map(ambulance => (
          <li key={ambulance.id}>
            <strong>{ambulance.name}</strong> - {ambulance.phone} - {ambulance.location}
          </li>
        ))}
      </ul>
    ) : (
      <p>No ambulances found.</p>
    )}
  </div>
);

function App() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Error state for failed API fetch

  // Fetch data for alerts and ambulances
  useEffect(() => {
    // Fetch alerts from the backend
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/alerts");
        if (!response.ok) throw new Error("Failed to fetch alerts");
        const data = await response.json();
        setAlerts(data);
      } catch (err) {
        setError("Error fetching alerts: " + (err as Error).message);
      }
    };

    // Fetch ambulances from the backend
    const fetchAmbulances = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ambulances");
        if (!response.ok) throw new Error("Failed to fetch ambulances");
        const data = await response.json();
        setAmbulances(data);
      } catch (err) {
        setError("Error fetching ambulances: " + (err as Error).message);
      } finally {
        setLoading(false); // Stop loading after both requests complete
      }
    };

    fetchAlerts();
    fetchAmbulances();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<RiskMap />} />
            <Route path="alerts" element={<Alerts alerts={alerts} />} />
            <Route path="ambulance" element={<Ambulance ambulances={ambulances} />} />
            <Route path="symptoms" element={<Symptoms />} />
            <Route path="broadcast" element={<Broadcast />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
