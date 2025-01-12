import React, { useState } from 'react';
import { Activity, AlertCircle, ChevronRight } from 'lucide-react';

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
      'Seek medical attention if fever persists over 3 days'
    ]
  },
  {
    id: '2',
    name: 'Difficulty Breathing',
    severity: 'high',
    recommendations: [
      'Seek immediate medical attention',
      'Try to remain calm',
      'Sit upright to help breathing',
      'Use prescribed inhaler if available'
    ]
  },
  {
    id: '3',
    name: 'Headache',
    severity: 'low',
    recommendations: [
      'Rest in a quiet, dark room',
      'Stay hydrated',
      'Try over-the-counter pain relievers',
      'Apply cold or warm compress'
    ]
  }
];

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

const Symptoms = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Activity className="w-6 h-6 mr-2" />
            Symptom Checker
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
                  <p className="text-sm capitalize">
                    Severity Level: {selectedSymptom.severity}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Recommendations:</h4>
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

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Get Professional Help
                </button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a symptom to see recommendations
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
        <div>
          <h3 className="font-semibold text-yellow-900">Important Notice</h3>
          <p className="text-sm text-yellow-800 mt-1">
            This symptom checker is for informational purposes only and should not replace professional medical advice.
            If you're experiencing severe symptoms, please seek immediate medical attention.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Symptoms;