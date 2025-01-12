export interface HealthRisk {
  id: string;
  type: 'disease' | 'air' | 'water';
  level: 'low' | 'medium' | 'high';
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  recommendations: string[];
}

export interface EmergencyService {
  id: string;
  type: 'ambulance' | 'hospital';
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  contact: string;
  available: boolean;
  eta?: number;
}

export interface Alert {
  id: string;
  type: 'earthquake' | 'flood' | 'wildfire' | 'health';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  instructions: string[];
}