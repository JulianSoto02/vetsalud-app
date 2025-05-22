import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserList from './UserList';
import AccessDenied from './AccessDenied';
import { Settings } from 'lucide-react';

const Administration: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const hasAccess = isAuthenticated && (role === 'admin' || role === 'veterinarian');

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Settings className="mr-2 h-6 w-6 text-teal-600" />
            Administración
          </h2>
          <p className="text-gray-600">Gestión de usuarios y configuración del sistema</p>
        </div>
      </div>

      {hasAccess ? (
        <UserList canEditRoles={role === 'admin'} />
      ) : (
        <AccessDenied />
      )}
    </div>
  );
};

export default Administration;