import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import RiskMap from './RiskMap'; // Assuming RiskMap is in the same folder

<<<<<<< HEAD
const App = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
=======
const mockRisks: HealthRisk[] = [
  {
    id: '1',
    type: 'air',
    level: 'high',
    location: { lat: 27.6960, lng: 85.3451 },
    description: 'High air pollution levels detected',
    recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside'],
  },
  {
    id: '17',
    type: 'disease',
    level: 'high',
    location: { lat: 27.6960, lng: 85.3451 },
    description: 'HMPC Virus Infected area',
    recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside & Sanitize your hand properly'],
  },
  {
    id: '3',
    type: 'disease',
    level: 'high',
    location: { lat: 27.6909, lng: 85.3493 },
    description: 'Increased HMPV Cases detected',
    recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside'],
  },
  {
    id: '4',
    type: 'air',
    level: 'high',
    location: { lat: 27.6787, lng: 85.3237 },
    description: 'High air pollution levels detected',
    recommendations: ['Avoid outdoor activities', 'Dont drik water without filteration'],
  },
  {
    id: '16',
    type: 'water',
    level: 'high',
    location: { lat: 27.6787, lng: 85.3237 },
    description: 'High water pollution levels detected',
    recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside'],
  },
  {
    id: '5',
    type: 'water',
    level: 'medium',
    location: { lat: 27.6713, lng: 85.3560 },
    description: 'Water Level Decrease, Drink only after Boiling',
    recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside'],
  },
  {
    id: '2',
    type: 'disease',
    level: 'medium',
    location: { lat: 27.7272, lng: 85.3340 },
    description: 'Increased flu cases reported',
    recommendations: ['Practice social distancing', 'Get vaccinated'],
  }
];
>>>>>>> c310a7da4c485ff39d03de03ed42929cc168ea99

  const mockRisks = [
    { id: '1', type: 'air', level: 'high', location: { lat: 27.6960, lng: 85.3451 }, description: 'High air pollution levels detected', recommendations: ['Avoid outdoor activities', 'Wear N95 masks if going outside'] },
    { id: '2', type: 'disease', level: 'medium', location: { lat: 27.7272, lng: 85.3340 }, description: 'Increased flu cases reported', recommendations: ['Practice social distancing', 'Get vaccinated'] },
    // Add more mock data here
  ];

  const sendMessage = () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', text: input };
      setMessages(prev => [...prev, userMessage]);

      let botMessage = {
        sender: 'bot',
        text: 'Please ask about the health risk in your area or the safest place.',
      };

      // Simple query processing (example)
      if (input.toLowerCase().includes('disease')) {
        const diseaseRisks = mockRisks.filter(risk => risk.type === 'disease');
        botMessage.text = `The most common disease outbreaks are in these locations:\n${diseaseRisks.map(risk => `${risk.description} at location (${risk.location.lat}, ${risk.location.lng})`).join('\n')}`;
      } else if (input.toLowerCase().includes('safe')) {
        const safeLocations = mockRisks.filter(risk => risk.level === 'low');
        botMessage.text = `Safe areas with low health risks include:\n${safeLocations.map(risk => `Safe at location (${risk.location.lat}, ${risk.location.lng})`).join('\n')}`;
      }

      setMessages(prev => [...prev, botMessage]);
      setInput('');
    }
  };

  return (
    <div>
      <RiskMap />
      <button className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none"
        onClick={() => setIsChatVisible(prev => !prev)}>
        <MessageCircle className="w-6 h-6" />
      </button>

      {isChatVisible && (
        <div className="fixed bottom-16 right-4 w-80 h-96 bg-white shadow-lg border rounded-lg flex flex-col">
          <div className="p-4 bg-blue-600 text-white font-semibold flex justify-between items-center">
            <span>ChatBot</span>
            <button className="text-white" onClick={() => setIsChatVisible(false)}>×</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex space-x-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about health risks..." className="w-full p-2 border rounded-lg" />
            <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
