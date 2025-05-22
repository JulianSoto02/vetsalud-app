import React, { useState, useEffect } from 'react';
import { useData, MedicalRecord } from '../../context/DataContext';
import { X } from 'lucide-react';

interface RecordFormProps {
  petId: number;
  recordId: number | null;
  onClose: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({ petId, recordId, onClose }) => {
  const { 
    getPetById,
    medicalRecords, 
    addMedicalRecord, 
    updateMedicalRecord, 
    deleteMedicalRecord 
  } = useData();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    notes: '',
    veterinarian: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    date: '',
    diagnosis: '',
    veterinarian: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const pet = getPetById(petId);

  useEffect(() => {
    if (recordId) {
      const record = medicalRecords.find(r => r.id === recordId);
      if (record) {
        setFormData({
          date: record.date,
          diagnosis: record.diagnosis,
          treatment: record.treatment,
          notes: record.notes,
          veterinarian: record.veterinarian
        });
        setIsEditing(true);
      }
    }
  }, [recordId, medicalRecords]);

  const validateForm = () => {
    const errors = {
      date: '',
      diagnosis: '',
      veterinarian: ''
    };
    
    if (!formData.date) {
      errors.date = 'La fecha es requerida';
    }
    
    if (!formData.diagnosis.trim()) {
      errors.diagnosis = 'El diagnóstico es requerido';
    }
    
    if (!formData.veterinarian.trim()) {
      errors.veterinarian = 'El nombre del veterinario es requerido';
    }
    
    setFormErrors(errors);
    
    // Return true if there are no errors
    return !Object.values(errors).some(error => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the specific error when the user corrects the input
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isEditing && recordId) {
      const updatedRecord: MedicalRecord = {
        id: recordId,
        petId,
        date: formData.date,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes,
        veterinarian: formData.veterinarian
      };
      
      updateMedicalRecord(updatedRecord);
    } else {
      const newRecord = {
        petId,
        date: formData.date,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes,
        veterinarian: formData.veterinarian
      };
      
      addMedicalRecord(newRecord);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (recordId && window.confirm('¿Estás seguro de que deseas eliminar este registro médico?')) {
      deleteMedicalRecord(recordId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Editar Registro Médico' : 'Nuevo Registro Médico'}
            {pet && <span className="block text-sm font-normal text-gray-600 mt-1">
              {pet.name} ({pet.species})
            </span>}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Fecha
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 
                ${formErrors.date ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.date && (
              <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Diagnóstico
            </label>
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 
                ${formErrors.diagnosis ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Diagnóstico principal"
            />
            {formErrors.diagnosis && (
              <p className="text-red-500 text-xs mt-1">{formErrors.diagnosis}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Tratamiento
            </label>
            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Descripción del tratamiento recomendado"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Notas
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Observaciones adicionales"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Veterinario
            </label>
            <input
              type="text"
              name="veterinarian"
              value={formData.veterinarian}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 
                ${formErrors.veterinarian ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nombre del veterinario"
            />
            {formErrors.veterinarian && (
              <p className="text-red-500 text-xs mt-1">{formErrors.veterinarian}</p>
            )}
          </div>
          
          <div className="flex justify-end mt-6 space-x-3 border-t border-gray-100 pt-4">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                Eliminar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;