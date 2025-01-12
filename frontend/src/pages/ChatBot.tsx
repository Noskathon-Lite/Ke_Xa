import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [typing, setTyping] = useState(false);  // Track if the bot is typing

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setTyping(true);  // Show typing indicator

    try {
      const response = await fetch('https://api.cohere.com/v2/chat', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer otUjF9Q5PZ8xVxrgii4k1CwCRK0rNsTSLYWLYW8j',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-r-plus-08-2024',
          messages: [{ role: 'user', content: input }],
        }),
      });

      const body = await response.json();

      const botMessage = {
        sender: 'bot',
        text: body.message.content[0]?.text || 'Response received.',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'An error occurred while processing your request. Please try again later.',
        },
      ]);
    } finally {
      setLoading(false);
      setTyping(false);  // Hide typing indicator after response is received
    }
  };

  return (
    <>
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none"
        onClick={() => setIsChatVisible((prev) => !prev)}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isChatVisible && (
        <div className="fixed bottom-16 right-4 w-80 h-96 bg-white shadow-lg border rounded-lg flex flex-col">
          <div className="p-4 bg-blue-600 text-white font-semibold flex justify-between items-center">
            <span>AI Health Assistant</span>
            <button
              className="text-white"
              onClick={() => setIsChatVisible(false)}
            >
              X
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-1">
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce200"></div>
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce400"></div>
                </div>
                <span className="text-gray-500">Typing...</span>
              </div>
            )}

            {loading && (
              <div className="text-center text-gray-500">Generating response...</div>
            )}
          </div>

          <div className="p-4 border-t">
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Ask me something..."
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
