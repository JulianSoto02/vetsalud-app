import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Login from './Login';
import ClientHome from './ClientHome';
import { Activity } from 'lucide-react';

const ClientPortal: React.FC = () => {
  const { isAuthenticated, role, currentUser } = useAuth();
  const { pets } = useData();
  
  // Find pets that belong to the currently logged in client
  const clientPets = currentUser && role === 'client'
    ? pets.filter(pet => pet.ownerId === currentUser.id)
    : [];

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Activity className="mr-2 h-6 w-6 text-teal-600" />
            Portal del Cliente
          </h2>
          <p className="text-gray-600">Accede a la información de tus mascotas y citas</p>
        </div>
      </div>

      {isAuthenticated && role === 'client' ? (
        <ClientHome pets={clientPets} />
      ) : (
        <Login />
      )}
    </div>
  );
};

export default ClientPortal;