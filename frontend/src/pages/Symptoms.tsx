import React, { useState, useEffect } from 'react';
import { Activity, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

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
    id: '4',
    name: 'Chest Pain ',
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
];

const App = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Add a message when a symptom is selected
  useEffect(() => {
    if (selectedSymptom) {
      const autoMessage = {
        sender: 'bot',
        text: `You selected: ${selectedSymptom.name}. Here are some recommendations: ${selectedSymptom.recommendations.join(
          ', '
        )}.`,
      };
      setMessages((prev) => [...prev, autoMessage]);
    }
  }, [selectedSymptom]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Replace with your AI/ML API endpoint and adjust payload
      const response = await axios.post(
        'https://your-ai-ml-api-endpoint.com/predict',
        {
          input: input, // Customize the payload according to your API requirements
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `f6c52088b5744c6aa2508c2eea635bcd`, // Replace with your API key
          },
        }
      );

      // Adjust the response parsing based on your API response structure
      const botMessage = {
        sender: 'bot',
        text: response.data.output || 'No response from AI.',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'An error occurred. Please try again later.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex h-screen">
      {/* Symptom Checker Section */}
      <div className="flex-1 space-y-6 p-6">
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
                    <p className="text-sm capitalize">Severity Level: {selectedSymptom.severity}</p>
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
              This symptom checker is for informational purposes only and should not replace
              professional medical advice. If you're experiencing severe symptoms, please seek
              immediate medical attention.
            </p>
          </div>
        </div>
      </div>

      {/* ChatBot Section */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l flex flex-col">
        <div className="p-4 bg-blue-600 text-white font-semibold">ChatBot</div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-500 text-center">Typing...</div>}
        </div>

        <div className="p-4 border-t flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about symptoms..."
            className="w-full p-2 border rounded-lg"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
