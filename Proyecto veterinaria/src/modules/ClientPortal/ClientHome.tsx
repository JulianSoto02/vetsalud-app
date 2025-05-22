import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData, Pet, Appointment, Vaccination } from '../../context/DataContext';
import { LogOut, Calendar, BedDouble as Needle, AlertCircle } from 'lucide-react';

interface ClientHomeProps {
  pets: Pet[];
}

const ClientHome: React.FC<ClientHomeProps> = ({ pets }) => {
  const { currentUser, logout } = useAuth();
  const { appointments, vaccinations } = useData();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(
    pets.length > 0 ? pets[0].id : null
  );

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Get upcoming appointments for the selected pet
  const getUpcomingAppointments = (): Appointment[] => {
    if (!selectedPetId) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return (
          appointment.petId === selectedPetId && 
          appointmentDate >= today && 
          appointment.status === 'scheduled'
        );
      })
      .sort((a, b) => {
        // Sort by date first
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  };

  // Get upcoming vaccinations for the selected pet
  const getUpcomingVaccinations = (): Vaccination[] => {
    if (!selectedPetId) return [];

    const today = new Date();
    
    return vaccinations
      .filter(vaccination => {
        const dueDate = new Date(vaccination.nextDueDate);
        return (
          vaccination.petId === selectedPetId && 
          vaccination.status === 'pending'
        );
      })
      .sort((a, b) => {
        // Sort by next due date
        const dateA = new Date(a.nextDueDate);
        const dateB = new Date(b.nextDueDate);
        return dateA.getTime() - dateB.getTime();
      });
  };

  // Get urgent vaccinations (due within 30 days)
  const getUrgentVaccinations = (): Vaccination[] => {
    const upcomingVaccinations = getUpcomingVaccinations();
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return upcomingVaccinations.filter(vaccination => {
      const dueDate = new Date(vaccination.nextDueDate);
      return dueDate <= thirtyDaysFromNow;
    });
  };

  const upcomingAppointments = getUpcomingAppointments();
  const upcomingVaccinations = getUpcomingVaccinations();
  const urgentVaccinations = getUrgentVaccinations();
  const selectedPet = pets.find(pet => pet.id === selectedPetId);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Bienvenido, {currentUser?.name}
            </h3>
            <p className="text-gray-600">{currentUser?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center text-red-600 hover:text-red-800 focus:outline-none"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {pets.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-500">No tienes mascotas registradas en el sistema.</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Mis Mascotas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pets.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`text-left p-4 rounded-md transition-colors flex items-start ${
                    selectedPetId === pet.id
                      ? 'bg-teal-100 border-2 border-teal-500'
                      : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                  }`}
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{pet.name}</h4>
                    <p className="text-sm text-gray-600">{pet.species} • {pet.breed}</p>
                    <p className="text-sm text-gray-500">{pet.age} años</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedPet && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-teal-600 px-4 py-3 text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Próximas Citas</h3>
                </div>
                <div className="p-4">
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAppointments.map(appointment => (
                        <div 
                          key={appointment.id}
                          className="p-3 bg-gray-50 rounded-md border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(appointment.date)} - {appointment.time}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {appointment.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No hay citas programadas.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-teal-600 px-4 py-3 text-white flex items-center">
                  <Needle className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Vacunas</h3>
                </div>
                <div className="p-4">
                  {upcomingVaccinations.length > 0 ? (
                    <div className="space-y-3">
                      {urgentVaccinations.length > 0 && (
                        <div className="flex items-center bg-yellow-50 text-yellow-800 p-3 rounded-md border border-yellow-200 mb-3">
                          <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                          <p className="text-sm">
                            Tienes {urgentVaccinations.length} vacuna{urgentVaccinations.length > 1 ? 's' : ''} que vence{urgentVaccinations.length > 1 ? 'n' : ''} pronto.
                          </p>
                        </div>
                      )}
                      
                      {upcomingVaccinations.map(vaccination => {
                        const dueDate = new Date(vaccination.nextDueDate);
                        const today = new Date();
                        const thirtyDaysFromNow = new Date(today);
                        thirtyDaysFromNow.setDate(today.getDate() + 30);
                        
                        const isUrgent = dueDate <= thirtyDaysFromNow;
                        const isPastDue = dueDate < today;
                        
                        return (
                          <div 
                            key={vaccination.id}
                            className={`p-3 rounded-md border ${
                              isPastDue 
                                ? 'bg-red-50 border-red-200 text-red-800' 
                                : isUrgent
                                  ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                  : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <p className="text-sm font-medium">
                              {vaccination.name}
                            </p>
                            <p className={`text-sm mt-1 ${
                              isPastDue 
                                ? 'text-red-600' 
                                : isUrgent
                                  ? 'text-yellow-700'
                                  : 'text-gray-600'
                            }`}>
                              Próxima dosis: {formatDate(vaccination.nextDueDate)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No hay vacunas pendientes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientHome;