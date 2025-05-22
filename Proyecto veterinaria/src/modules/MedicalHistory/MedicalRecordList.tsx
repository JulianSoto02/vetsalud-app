import React from 'react';
import { MedicalRecord } from '../../context/DataContext';
import { Edit } from 'lucide-react';

interface MedicalRecordListProps {
  records: MedicalRecord[];
  onEdit: (id: number) => void;
}

const MedicalRecordList: React.FC<MedicalRecordListProps> = ({ records, onEdit }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (records.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">No hay registros médicos para esta mascota.</p>
      </div>
    );
  }

  // Sort records by date (newest first)
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedRecords.map(record => (
        <div 
          key={record.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Fecha: {formatDate(record.date)}</p>
                <h4 className="text-lg font-medium text-gray-900 mt-1">{record.diagnosis}</h4>
                <p className="text-sm text-gray-500 mt-1">Veterinario: {record.veterinarian}</p>
              </div>
              <button
                onClick={() => onEdit(record.id)}
                className="text-teal-600 hover:text-teal-800 focus:outline-none"
              >
                <Edit className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">Tratamiento</h5>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {record.treatment}
                </p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">Notas</h5>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {record.notes}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicalRecordList;