import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, Map, Ambulance, Activity, Radio } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const [dateTime, setDateTime] = useState('');

  const links = [
    { to: '/', icon: Map, label: 'Health Risk Heat-Map' },
    { to: '/alerts', icon: Bell, label: 'Earthquake Alerts' },
    { to: '/ambulance', icon: Ambulance, label: 'Ambulance Co-ordination' },
    { to: '/symptoms', icon: Activity, label: 'A.I. Powered Symptoms Checker' },
    { to: '/broadcast', icon: Radio, label: 'Emergency Broadcast System' },
  ];

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleString('ne-NP', { timeZone: 'Asia/Kathmandu' }));
    };

    const intervalId = setInterval(updateDateTime, 1000);
    updateDateTime(); // Initial call

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-gray-200  py-4 shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          {/* Left side (logo and title) */}
          <div className="flex items-center space-x-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Transhumanism_h%2B.svg/2048px-Transhumanism_h%2B.svg.png" alt="Logo" className="h-10" />
            <h1 className="text-3xl font-bold text-gray-900">Health Emergency & Safety App</h1>
          </div>

          {/* Right side (date, time, and flag) */}
          <div className="flex items-center space-x-4">
            <div className="text-red-500 font-medium">{dateTime}</div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_Nepal.png" alt="Nepali Flag" className="h-6 w-6" />
          </div>
        </div>
      </nav>

      <div className="flex pt-20">
        {/* Sidebar */}
        <nav className="w-73 bg-white border-r border-gray-200 fixed left-0 top-20 bottom-0 flex flex-col items-start p-4 space-y-4 shadow-lg">
          <div className="text-lg font-semibold mb-4">Your Health App</div>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-2 p-3 rounded-lg w-full text-left transition-all duration-300 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Main Content */}
        <div className="flex-1 ml-72 px-6 py-8">
          <header>
            <div className="flex justify-between items-center">
              {/* Main content header (optional) */}
            </div>
          </header>

          {/* Risk Map Content */}
          <main className="pb-20 md:pb-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
