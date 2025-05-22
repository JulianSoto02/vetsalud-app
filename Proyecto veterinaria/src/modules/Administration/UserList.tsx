import React, { useState } from 'react';
import { useAuth, User, UserRole } from '../../context/AuthContext';
import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion, User as UserIcon } from 'lucide-react';

interface UserListProps {
  canEditRoles: boolean;
}

const UserList: React.FC<UserListProps> = ({ canEditRoles }) => {
  const { users, updateUserRole } = useAuth();
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case 'veterinarian':
        return <ShieldCheck className="h-5 w-5 text-teal-500" />;
      case 'assistant':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'client':
        return <UserIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ShieldQuestion className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'veterinarian':
        return 'Veterinario';
      case 'assistant':
        return 'Asistente';
      case 'client':
        return 'Cliente';
      default:
        return 'Desconocido';
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'veterinarian':
        return 'bg-teal-100 text-teal-800';
      case 'assistant':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const startEditingRole = (userId: number, currentRole: UserRole) => {
    setEditingUserId(userId);
    setSelectedRole(currentRole);
  };

  const cancelEditingRole = () => {
    setEditingUserId(null);
  };

  const saveRole = (userId: number) => {
    updateUserRole(userId, selectedRole);
    setEditingUserId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            {canEditRoles && (
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUserId === user.id ? (
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="admin">Administrador</option>
                    <option value="veterinarian">Veterinario</option>
                    <option value="assistant">Asistente</option>
                    <option value="client">Cliente</option>
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                    <span className="flex items-center">
                      {getRoleIcon(user.role)}
                      <span className="ml-1">{getRoleName(user.role)}</span>
                    </span>
                  </span>
                )}
              </td>
              {canEditRoles && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingUserId === user.id ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => cancelEditingRole()}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none focus:underline"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => saveRole(user.id)}
                        className="text-teal-600 hover:text-teal-800 focus:outline-none focus:underline"
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditingRole(user.id, user.role)}
                      className="text-teal-600 hover:text-teal-900 focus:outline-none focus:underline"
                    >
                      Cambiar Rol
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;