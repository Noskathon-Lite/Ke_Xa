import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Phone, Clock, AlertCircle } from 'lucide-react';
import { EmergencyService } from '../types';
import 'leaflet/dist/leaflet.css';

const mockAmbulances: EmergencyService[] = [
  {
    id: '1',
    type: 'ambulance',
    name: 'City Emergency Response Unit 1',
    location: { lat: 27.6859, lng: 85.3469 },
    contact: '+1-555-0123',
    available: true,
    eta: 5
  },
  {
    id: '2',
    type: 'ambulance',
    name: 'Medical Transport Unit 2',
    location: { lat: 27.6748, lng: 85.3565 },
    contact: '+1-555-0124',
    available: false,
    eta: 8
  },
  {
    id: '12',
    type: 'ambulance',
    name: 'Medical Transport Unit 2',
    location: { lat: 37.6748, lng: 85.3565 },
    contact: '+977-9800760000',
    available: true,
    eta: 10
  },
  {
    id: '3',
    type: 'ambulance',
    name: 'Medical Transport Unit 23',
    location: { lat: 27.6712, lng: 85.3415 },
    contact: '+1-575-06764',
    available: true,
    eta: 67
  },
  {
    id: '4',
    type: 'ambulance',
    name: 'Medical Transport Unit 5',
    location: { lat: 27.6854, lng: 85.335 },
    contact: '+1-879-0124',
    available: true,
    eta: 90
  }

];

const Ambulance = () => {
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Ambulance Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {mockAmbulances.map((service) => (
              <div
                key={service.id}
                className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => setSelectedService(service)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {service.contact}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        ETA: {service.eta} minutes
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    service.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.available ? 'Available' : 'Busy'}
                  </span>
                </div>
                <div className="mt-4">
                  <button 
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${service.contact}`;
                    }}
                  >
                    Call Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapContainer
              center={[27.6844, 85.3479]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {mockAmbulances.map((service) => (
                <Marker
                  key={service.id}
                  position={[service.location.lat, service.location.lng]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm mt-1">ETA: {service.eta} minutes</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">Emergency Guidelines</h3>
          <p className="text-sm text-blue-800 mt-1">
            If this is a life-threatening emergency, please dial 911 immediately. Our service helps coordinate
            non-emergency medical transport and supplementary emergency services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ambulance;