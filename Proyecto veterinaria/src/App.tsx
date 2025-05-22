import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Appointments from './modules/Appointments';
import MedicalHistory from './modules/MedicalHistory';
import ClientPortal from './modules/ClientPortal';
import Notifications from './modules/Notifications';
import Reports from './modules/Reports';
import Administration from './modules/Administration';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  const [activeTab, setActiveTab] = useState('citas');

  const renderContent = () => {
    switch (activeTab) {
      case 'citas':
        return <Appointments />;
      case 'historial':
        return <MedicalHistory />;
      case 'portal':
        return <ClientPortal />;
      case 'notificaciones':
        return <Notifications />;
      case 'reportes':
        return <Reports />;
      case 'administracion':
        return <Administration />;
      default:
        return <Appointments />;
    }
  };

  return (
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-grow p-4 md:p-6 lg:p-8 container mx-auto">
              {renderContent()}
            </main>
            <footer className="bg-teal-700 text-white p-4 text-center text-sm">
              <p>© 2025 VetSalud - Clínica Veterinaria. Todos los derechos reservados.</p>
            </footer>
          </div>
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;