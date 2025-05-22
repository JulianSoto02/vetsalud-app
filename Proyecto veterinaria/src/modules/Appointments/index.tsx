import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import { Calendar, Plus } from 'lucide-react';

const Appointments: React.FC = () => {
  const { appointments } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  
  const openForm = (appointmentId?: number) => {
    setSelectedAppointment(appointmentId || null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedAppointment(null);
    setIsFormOpen(false);
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate >= today && appointment.status === 'scheduled';
      })
      .sort((a, b) => {
        // Sort by date first
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        
        // If same date, sort by time
        return a.time.localeCompare(b.time);
      });
  };

  const getPastAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate < today || appointment.status !== 'scheduled';
      })
      .sort((a, b) => {
        // Sort by date in descending order
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
  };

  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Calendar className="mr-2 h-6 w-6 text-teal-600" />
            Gestión de Citas
          </h2>
          <p className="text-gray-600">Agenda, modifica y gestiona las citas veterinarias</p>
        </div>
        <button 
          onClick={() => openForm()}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200"
        >
          <Plus className="h-5 w-5 mr-1" />
          Nueva Cita
        </button>
      </div>

      {isFormOpen && (
        <AppointmentForm 
          appointmentId={selectedAppointment} 
          onClose={closeForm} 
        />
      )}

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Próximas Citas</h3>
        {upcomingAppointments.length > 0 ? (
          <AppointmentList 
            appointments={upcomingAppointments} 
            onEdit={openForm}
          />
        ) : (
          <p className="text-gray-500 bg-gray-50 p-4 rounded-md border border-gray-200 text-center">
            No hay citas programadas próximamente.
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Historial de Citas</h3>
        {pastAppointments.length > 0 ? (
          <AppointmentList 
            appointments={pastAppointments} 
            onEdit={openForm}
            isPast={true}
          />
        ) : (
          <p className="text-gray-500 bg-gray-50 p-4 rounded-md border border-gray-200 text-center">
            No hay historial de citas.
          </p>
        )}
      </div>
    </div>
  );
};

export default Appointments;