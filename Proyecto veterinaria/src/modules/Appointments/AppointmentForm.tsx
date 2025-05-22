import React, { useState, useEffect } from 'react';
import { useData, Appointment } from '../../context/DataContext';
import { X } from 'lucide-react';

interface AppointmentFormProps {
  appointmentId: number | null;
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointmentId, onClose }) => {
  const { 
    pets, 
    appointments, 
    addAppointment, 
    updateAppointment, 
    deleteAppointment,
    checkAppointmentConflict
  } = useData();

  const [formData, setFormData] = useState({
    petId: 0,
    date: '',
    time: '',
    reason: '',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled'
  });
  
  const [formErrors, setFormErrors] = useState({
    petId: '',
    date: '',
    time: '',
    reason: '',
    conflict: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      const appointment = appointments.find(a => a.id === appointmentId);
      if (appointment) {
        setFormData({
          petId: appointment.petId,
          date: appointment.date,
          time: appointment.time,
          reason: appointment.reason,
          status: appointment.status
        });
        setIsEditing(true);
      }
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [appointmentId, appointments]);

  const validateForm = () => {
    const errors = {
      petId: '',
      date: '',
      time: '',
      reason: '',
      conflict: ''
    };
    
    if (!formData.petId) {
      errors.petId = 'Debes seleccionar una mascota';
    }
    
    if (!formData.date) {
      errors.date = 'La fecha es requerida';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today && formData.status === 'scheduled') {
        errors.date = 'No puedes agendar citas en fechas pasadas';
      }
    }
    
    if (!formData.time) {
      errors.time = 'La hora es requerida';
    }
    
    if (!formData.reason.trim()) {
      errors.reason = 'El motivo de la cita es requerido';
    }
    
    // Check for appointment conflicts
    if (formData.date && formData.time) {
      const hasConflict = checkAppointmentConflict(
        formData.date, 
        formData.time,
        appointmentId || undefined
      );
      
      if (hasConflict) {
        errors.conflict = 'Ya existe una cita programada para esta fecha y hora';
      }
    }
    
    setFormErrors(errors);
    
    // Return true if there are no errors
    return !Object.values(errors).some(error => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the specific error when the user corrects the input
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear conflict error when date or time changes
    if (name === 'date' || name === 'time') {
      setFormErrors(prev => ({ ...prev, conflict: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const selectedPet = pets.find(p => p.id === formData.petId);
    
    if (!selectedPet) {
      setFormErrors(prev => ({ ...prev, petId: 'Mascota no encontrada' }));
      return;
    }

    if (isEditing && appointmentId) {
      const updatedAppointment: Appointment = {
        id: appointmentId,
        petId: formData.petId,
        petName: selectedPet.name,
        ownerName: selectedPet.owner,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        status: formData.status
      };
      
      updateAppointment(updatedAppointment);
    } else {
      const newAppointment = {
        petId: formData.petId,
        petName: selectedPet.name,
        ownerName: selectedPet.owner,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        status: formData.status as 'scheduled' | 'completed' | 'cancelled'
      };
      
      addAppointment(newAppointment);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (appointmentId && window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      deleteAppointment(appointmentId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Editar Cita' : 'Nueva Cita'}
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
              Mascota
            </label>
            <select
              name="petId"
              value={formData.petId}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 
                ${formErrors.petId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value={0}>Selecciona una mascota</option>
              {pets.map(pet => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species} - {pet.owner})
                </option>
              ))}
            </select>
            {formErrors.petId && (
              <p className="text-red-500 text-xs mt-1">{formErrors.petId}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
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
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Hora
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 
                  ${formErrors.time ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.time && (
                <p className="text-red-500 text-xs mt-1">{formErrors.time}</p>
              )}
            </div>
          </div>

          {formErrors.conflict && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {formErrors.conflict}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Motivo de la Cita
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 
                ${formErrors.reason ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe el motivo de la cita..."
            ></textarea>
            {formErrors.reason && (
              <p className="text-red-500 text-xs mt-1">{formErrors.reason}</p>
            )}
          </div>
          
          {isEditing && (
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
                <option value="scheduled">Programada</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          )}
          
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

export default AppointmentForm;