import React, { useState } from 'react';
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
          text: 'An error Occurred While Processing Your Request. Please Try Again Later.',
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
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 md:p-5 shadow-lg hover:bg-blue-700 focus:outline-none transition duration-300"
        onClick={() => setIsChatVisible((prev) => !prev)}
      >
        <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {isChatVisible && (
        <div className="fixed bottom-24 right-6 w-full sm:w-96 md:w-[400px] lg:w-[500px] h-[80vh] sm:h-96 bg-gradient-to-tl from-blue-400 to-blue-600 shadow-xl border rounded-2xl flex flex-col">
          <div className="p-4 bg-blue-800 text-white font-semibold flex justify-between items-center rounded-t-2xl shadow-lg">
            <span className="text-sm sm:text-lg">AI Health Assistant</span>
            <button
              className="text-white text-xl"
              onClick={() => setIsChatVisible(false)}
            >
              &times;
            </button>
          </div>

          {/* This is the scrollable area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] sm:max-w-[75%] p-4 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start space-x-2 items-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce200"></div>
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce400"></div>
                <span className="text-white text-sm">Thinking...</span>
              </div>
            )}

            {loading && (
              <div className="text-center text-white text-sm">Generating best Response for you...</div>
            )}
          </div>

          <div className="p-4 sm:p-6 border-t bg-gray-100 rounded-b-2xl">
            <input
              type="text"
              className="w-full p-3 sm:p-4 border rounded-xl shadow-md"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Ask me Anything..."
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
