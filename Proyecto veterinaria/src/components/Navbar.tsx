import React from 'react';
import { Activity, Calendar, ClipboardList, Bell, BarChart, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { isAuthenticated, role } = useAuth();

  const tabs = [
    { id: 'citas', name: 'Citas', icon: <Calendar className="h-5 w-5" /> },
    { id: 'historial', name: 'Historial Médico', icon: <ClipboardList className="h-5 w-5" /> },
    { id: 'portal', name: 'Portal Cliente', icon: <Activity className="h-5 w-5" /> },
    { id: 'notificaciones', name: 'Notificaciones', icon: <Bell className="h-5 w-5" /> },
    { id: 'reportes', name: 'Reportes', icon: <BarChart className="h-5 w-5" /> },
    { id: 'administracion', name: 'Administración', icon: <Settings className="h-5 w-5" /> },
  ];

  // Filter tabs based on role
  const visibleTabs = tabs.filter(tab => {
    if (tab.id === 'administracion' && role !== 'admin' && role !== 'veterinarian') {
      return false;
    }
    return true;
  });

  return (
    <header className="bg-teal-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3">
          <div className="flex items-center justify-between mb-3 md:mb-0">
            <div className="flex items-center">
              <Activity className="h-8 w-8 mr-2" />
              <h1 className="text-xl font-bold">VetSalud</h1>
            </div>
            <button className="md:hidden" onClick={() => {}}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <nav className="md:flex md:items-center">
            <ul className="flex flex-wrap md:space-x-1">
              {visibleTabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                      ${activeTab === tab.id 
                        ? 'bg-teal-800 text-white' 
                        : 'text-teal-100 hover:bg-teal-600 hover:text-white'}`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;