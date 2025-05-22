import React, { useState, useEffect } from 'react';
import { useData, Vaccination } from '../../context/DataContext';
import { X } from 'lucide-react';

interface VaccinationFormProps {
  petId: number;
  vaccinationId: number | null;
  onClose: () => void;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({ petId, vaccinationId, onClose }) => {
  const { 
    getPetById,
    vaccinations, 
    addVaccination, 
    updateVaccination, 
    deleteVaccination 
  } = useData();

  // Calculate default next due date (1 year from today)
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  const [formData, setFormData] = useState({
    name: '',
    date: today.toISOString().split('T')[0],
    nextDueDate: nextYear.toISOString().split('T')[0],
    status: 'pending' as 'completed' | 'pending'
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    date: '',
    nextDueDate: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const pet = getPetById(petId);

  useEffect(() => {
    if (vaccinationId) {
      const vaccination = vaccinations.find(v => v.id === vaccinationId);
      if (vaccination) {
        setFormData({
          name: vaccination.name,
          date: vaccination.date,
          nextDueDate: vaccination.nextDueDate,
          status: vaccination.status
        });
        setIsEditing(true);
      }
    }
  }, [vaccinationId, vaccinations]);

  const validateForm = () => {
    const errors = {
      name: '',
      date: '',
      nextDueDate: ''
    };
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre de la vacuna es requerido';
    }
    
    if (!formData.date) {
      errors.date = 'La fecha de aplicación es requerida';
    }
    
    if (!formData.nextDueDate) {
      errors.nextDueDate = 'La fecha de próxima aplicación es requerida';
    } else if (new Date(formData.nextDueDate) <= new Date(formData.date)) {
      errors.nextDueDate = 'La fecha de próxima aplicación debe ser posterior a la fecha de aplicación';
    }
    
    setFormErrors(errors);
    
    // Return true if there are no errors
    return !Object.values(errors).some(error => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (isEditing && vaccinationId) {
      const updatedVaccination: Vaccination = {
        id: vaccinationId,
        petId,
        name: formData.name,
        date: formData.date,
        nextDueDate: formData.nextDueDate,
        status: formData.status
      };
      
      updateVaccination(updatedVaccination);
    } else {
      const newVaccination = {
        petId,
        name: formData.name,
        date: formData.date,
        nextDueDate: formData.nextDueDate,
        status: formData.status
      };
      
      addVaccination(newVaccination);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (vaccinationId && window.confirm('¿Estás seguro de que deseas eliminar este registro de vacunación?')) {
      deleteVaccination(vaccinationId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Editar Vacunación' : 'Nueva Vacunación'}
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
              Nombre de la Vacuna
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 
                ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ej: Rabia, Polivalente, Triple Felina"
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Fecha de Aplicación
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
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Próxima Aplicación
              </label>
              <input
                type="date"
                name="nextDueDate"
                value={formData.nextDueDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 
                  ${formErrors.nextDueDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.nextDueDate && (
                <p className="text-red-500 text-xs mt-1">{formErrors.nextDueDate}</p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Estado
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="pending">Pendiente</option>
              <option value="completed">Completada</option>
            </select>
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

export default VaccinationForm;