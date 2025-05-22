import React from 'react';
import { ShieldOff, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AccessDenied: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        {isAuthenticated ? (
          <ShieldOff className="h-8 w-8 text-red-500" />
        ) : (
          <Lock className="h-8 w-8 text-red-500" />
        )}
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">Acceso Denegado</h3>
      <p className="text-gray-600 mb-6">
        {isAuthenticated
          ? 'No tienes los permisos necesarios para acceder a esta sección.'
          : 'Debes iniciar sesión para acceder a esta sección.'}
      </p>
      <p className="text-sm text-gray-500">
        Si crees que esto es un error, contacta al administrador del sistema.
      </p>
    </div>
  );
};

export default AccessDenied;