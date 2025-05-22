import React from 'react';
import { Vaccination } from '../../context/DataContext';
import { Edit, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface VaccinationListProps {
  vaccinations: Vaccination[];
  onEdit: (id: number) => void;
}

const VaccinationList: React.FC<VaccinationListProps> = ({ vaccinations, onEdit }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getVaccinationStatus = (vaccination: Vaccination) => {
    const now = new Date();
    const dueDate = new Date(vaccination.nextDueDate);
    
    // If the vaccination is already marked as completed
    if (vaccination.status === 'completed') {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        text: 'Completada',
        color: 'text-green-700 bg-green-100'
      };
    }
    
    // If the next due date is in the past
    if (dueDate < now) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        text: 'Vencida',
        color: 'text-red-700 bg-red-100'
      };
    }
    
    // If the next due date is within 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    if (dueDate <= thirtyDaysFromNow) {
      return {
        icon: <Clock className="h-5 w-5 text-yellow-500" />,
        text: 'Próxima',
        color: 'text-yellow-700 bg-yellow-100'
      };
    }
    
    // Otherwise, it's pending but not urgent
    return {
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      text: 'Pendiente',
      color: 'text-blue-700 bg-blue-100'
    };
  };

  if (vaccinations.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">No hay vacunas registradas para esta mascota.</p>
      </div>
    );
  }

  // Sort vaccinations by next due date (soonest first)
  const sortedVaccinations = [...vaccinations].sort((a, b) => {
    return new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime();
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vacuna
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Última Aplicación
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Próxima Dosis
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedVaccinations.map((vaccination) => {
            const status = getVaccinationStatus(vaccination);
            
            return (
              <tr key={vaccination.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{vaccination.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(vaccination.date)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(vaccination.nextDueDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                    <span className="flex items-center">
                      {status.icon}
                      <span className="ml-1">{status.text}</span>
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(vaccination.id)}
                    className="text-teal-600 hover:text-teal-900 focus:outline-none focus:underline"
                  >
                    <span className="flex items-center justify-end">
                      <Edit className="h-4 w-4 mr-1" />
                      <span>Editar</span>
                    </span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VaccinationList;