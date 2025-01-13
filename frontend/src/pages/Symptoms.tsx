import React, { useState } from 'react';
import { Activity, ChevronRight } from 'lucide-react';
import Chatbot from './ChatBot';

interface Symptom {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

const mockSymptoms: Symptom[] = [
  {
    id: '1',
    name: 'Fever',
    severity: 'medium',
    recommendations: [
      'Rest and stay hydrated',
      'Take over-the-counter fever reducers',
      'Monitor temperature regularly',
      'Seek medical attention if fever persists over 3 days',
    ],
  },
  {
    id: '2',
    name: 'Difficulty Breathing',
    severity: 'high',
    recommendations: [
      'Seek immediate medical attention',
      'Try to remain calm',
      'Sit upright to help breathing',
      'Use prescribed inhaler if available',
    ],
  },
  {
    id: '3',
    name: 'Headache',
    severity: 'low',
    recommendations: [
      'Rest in a quiet, dark room',
      'Stay hydrated',
      'Try over-the-counter pain relievers',
      'Apply cold or warm compress',
    ],
  },
  {
    id: '4',
    name: 'Nausea',
    severity: 'medium',
    recommendations: [
      'Sip on clear fluids',
      'Rest and avoid strong odors or triggers',
      'Try ginger tea or crackers',
      'Seek medical attention if nausea persists or is accompanied by vomiting',
    ],
  },
  {
    id: '5',
    name: 'Chest Pain',
    severity: 'high',
    recommendations: [
      'Seek immediate medical attention',
      'Stay calm and avoid physical activity',
      'If pain is severe, call emergency services',
      'Do not drive yourself to the hospital if symptoms are severe',
    ],
  },
  {
    id: '6',
    name: 'Cough',
    severity: 'medium',
    recommendations: [
      'Rest and stay hydrated',
      'Use over-the-counter cough syrup or lozenges',
      'Avoid smoking and secondhand smoke',
      'Seek medical attention if cough lasts more than 3 weeks or is accompanied by blood',
    ],
  },
  {
    id: '7',
    name: 'Sore Throat',
    severity: 'low',
    recommendations: [
      'Gargle with warm salt water',
      'Use throat lozenges or sprays',
      'Stay hydrated and rest your voice',
      'Seek medical attention if pain persists for more than 5 days',
    ],
  },
  {
    id: '8',
    name: 'Fatigue',
    severity: 'medium',
    recommendations: [
      'Ensure adequate sleep and rest',
      'Eat a balanced diet with plenty of fruits and vegetables',
      'Avoid overexerting yourself',
      'Seek medical attention if fatigue persists for more than two weeks',
    ],
  },
  {
    id: '9',
    name: 'Dizziness',
    severity: 'medium',
    recommendations: [
      'Sit or lie down immediately to prevent falls',
      'Avoid sudden movements or standing up quickly',
      'Stay hydrated and avoid alcohol',
      'Seek medical attention if dizziness persists or is accompanied by other symptoms like nausea or chest pain',
    ],
  },
  
];


const App = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);

  const getSeverityColor = (severity: Symptom['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Symptom Checker Section */}
      <div className="flex-1 space-y-6 p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="w-6 h-6 mr-2" />
              SYMPTOM CHECKER
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <h3 className="font-semibold text-gray-700">Common Symptoms</h3>
              {mockSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedSymptom?.id === symptom.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedSymptom(symptom)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{symptom.name}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>

            <div className="md:col-span-2">
              {selectedSymptom ? (
                <div className="space-y-6">
                  <div className={`rounded-lg p-4 ${getSeverityColor(selectedSymptom.severity)}`}>
                    <h3 className="font-semibold mb-2">{selectedSymptom.name}</h3>
                    <p className="text-sm capitalize">SEVERITY LEVEL: {selectedSymptom.severity}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">RECOMMENDATION:</h4>
                    <ul className="space-y-2">
                      {selectedSymptom.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-4 h-4 mt-1 mr-2 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  SELECT A SYMPTOM TO SEE RECOMMENDATION
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Section */}
      <Chatbot />
    </div>
  );
};

export default App;
