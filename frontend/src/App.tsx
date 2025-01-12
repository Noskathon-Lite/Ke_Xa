import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RiskMap from './pages/RiskMap';
import Alerts from './pages/Alerts';
import Ambulance from './pages/Ambulance';
import Symptoms from './pages/Symptoms';
import Broadcast from './pages/Broadcast';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<RiskMap />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="ambulance" element={<Ambulance />} />
            <Route path="symptoms" element={<Symptoms />} />
            <Route path="broadcast" element={<Broadcast />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;