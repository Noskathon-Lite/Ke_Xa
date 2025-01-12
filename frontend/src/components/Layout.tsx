import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, Map, Ambulance, Activity, Radio } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const links = [
    { to: '/', icon: Map, label: 'Risk Map' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
    { to: '/ambulance', icon: Ambulance, label: 'Ambulance' },
    { to: '/symptoms', icon: Activity, label: 'Symptoms' },
    { to: '/broadcast', icon: Radio, label: 'Broadcast' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:relative md:top-0 md:border-t-0 md:border-r">
      <div className="flex justify-around md:flex-col md:space-y-6 md:py-8">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="hidden md:inline">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const Layout = () => {
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleString('ne-NP', { timeZone: 'Asia/Kathmandu' }));
    };

    const intervalId = setInterval(updateDateTime, 1000);
    updateDateTime(); // Initial call

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
  
      // Format the date as "Jan 12, 2025"
      const formattedDate = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'Asia/Kathmandu',
      });
  
      // Format the time
      const formattedTime = now.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kathmandu',
      });
  
      setDateTime(`${formattedDate} _ ${formattedTime}`);
    };
  
    const intervalId = setInterval(updateDateTime, 1000);
    updateDateTime(); // Initial call
  
    return () => clearInterval(intervalId);
  }, []);
  

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src="/Users/harshchaudhary/Documents/Ke_Xa/frontend/src/assets/css/images/logo.png" alt="Logo" className="h-8" />
          <h1 className="text-2xl font-bold text-gray-900">
            Health Emergency & Safety
          </h1>
          <div className="text-gray-600">{dateTime}</div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <Navigation />
          <main className="flex-1 pb-20 md:pb-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
