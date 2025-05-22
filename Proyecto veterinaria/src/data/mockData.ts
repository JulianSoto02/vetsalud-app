import { Pet, Appointment, MedicalRecord, Vaccination } from '../context/DataContext';
import { User } from '../context/AuthContext';
import { Notification } from '../context/NotificationContext';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@vetsalud.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: 2,
    email: 'vet@vetsalud.com',
    name: 'Dr. María Rodríguez',
    role: 'veterinarian',
    password: 'vet123'
  },
  {
    id: 3,
    email: 'assistant@vetsalud.com',
    name: 'Juan Pérez',
    role: 'assistant',
    password: 'assistant123'
  },
  {
    id: 4,
    email: 'cliente@vetsalud.com',
    name: 'Ana Gómez',
    role: 'client',
    password: '1234'
  }
];

// Mock Pets
export const mockPets: Pet[] = [
  {
    id: 1,
    name: 'Max',
    species: 'Perro',
    breed: 'Labrador',
    age: 3,
    owner: 'Ana Gómez',
    ownerId: 4
  },
  {
    id: 2,
    name: 'Luna',
    species: 'Gato',
    breed: 'Siamés',
    age: 2,
    owner: 'Ana Gómez',
    ownerId: 4
  },
  {
    id: 3,
    name: 'Rocky',
    species: 'Perro',
    breed: 'Pastor Alemán',
    age: 5,
    owner: 'Carlos Martínez',
    ownerId: 5
  },
  {
    id: 4,
    name: 'Coco',
    species: 'Ave',
    breed: 'Canario',
    age: 1,
    owner: 'Laura Sánchez',
    ownerId: 6
  }
];

// Calculate dates relative to current date
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

// Format date to YYYY-MM-DD
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 1,
    petId: 1,
    petName: 'Max',
    ownerName: 'Ana Gómez',
    date: formatDate(tomorrow),
    time: '10:00',
    reason: 'Vacunación anual',
    status: 'scheduled'
  },
  {
    id: 2,
    petId: 2,
    petName: 'Luna',
    ownerName: 'Ana Gómez',
    date: formatDate(dayAfterTomorrow),
    time: '15:30',
    reason: 'Revisión general',
    status: 'scheduled'
  },
  {
    id: 3,
    petId: 3,
    petName: 'Rocky',
    ownerName: 'Carlos Martínez',
    date: formatDate(today),
    time: '12:00',
    reason: 'Problemas digestivos',
    status: 'scheduled'
  },
  {
    id: 4,
    petId: 1,
    petName: 'Max',
    ownerName: 'Ana Gómez',
    date: formatDate(lastWeek),
    time: '09:30',
    reason: 'Desparasitación',
    status: 'completed'
  }
];

// Mock Medical Records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 1,
    petId: 1,
    date: formatDate(lastWeek),
    diagnosis: 'Parásitos intestinales',
    treatment: 'Desparasitante oral 10mg/kg',
    notes: 'Repetir en 15 días. Dueño reporta diarrea leve.',
    veterinarian: 'Dr. María Rodríguez'
  },
  {
    id: 2,
    petId: 2,
    date: formatDate(new Date(lastWeek.getTime() - 14 * 24 * 60 * 60 * 1000)),
    diagnosis: 'Otitis externa',
    treatment: 'Limpieza + gotas óticas antibióticas',
    notes: 'Aplicar 2 veces al día por 7 días',
    veterinarian: 'Dr. María Rodríguez'
  },
  {
    id: 3,
    petId: 3,
    date: formatDate(new Date(lastWeek.getTime() - 30 * 24 * 60 * 60 * 1000)),
    diagnosis: 'Dermatitis alérgica',
    treatment: 'Antihistamínicos + shampoo medicado',
    notes: 'Posible alergia alimentaria. Recomendar cambio de dieta.',
    veterinarian: 'Dr. Carlos Sánchez'
  }
];

// Mock Vaccinations
export const mockVaccinations: Vaccination[] = [
  {
    id: 1,
    petId: 1,
    name: 'Polivalente',
    date: formatDate(new Date(lastWeek.getTime() - 180 * 24 * 60 * 60 * 1000)),
    nextDueDate: formatDate(tomorrow),
    status: 'pending'
  },
  {
    id: 2,
    petId: 1,
    name: 'Rabia',
    date: formatDate(new Date(lastWeek.getTime() - 300 * 24 * 60 * 60 * 1000)),
    nextDueDate: formatDate(new Date(today.getTime() + 65 * 24 * 60 * 60 * 1000)),
    status: 'pending'
  },
  {
    id: 3,
    petId: 2,
    name: 'Triple Felina',
    date: formatDate(new Date(lastWeek.getTime() - 240 * 24 * 60 * 60 * 1000)),
    nextDueDate: formatDate(new Date(today.getTime() + 125 * 24 * 60 * 60 * 1000)),
    status: 'pending'
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Recordatorio de cita',
    message: 'Max tiene una cita programada para mañana a las 10:00',
    type: 'appointment',
    date: new Date().toISOString(),
    read: false,
    petId: 1,
    appointmentId: 1
  },
  {
    id: 2,
    title: 'Vacuna pendiente',
    message: 'La vacuna Polivalente de Max está próxima a vencer',
    type: 'vaccination',
    date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    petId: 1
  },
  {
    id: 3,
    title: 'Recordatorio de cita',
    message: 'Luna tiene una cita programada para pasado mañana a las 15:30',
    type: 'appointment',
    date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    petId: 2,
    appointmentId: 2
  },
  {
    id: 4,
    title: 'Mantenimiento del sistema',
    message: 'El sistema estará en mantenimiento este sábado de 00:00 a 02:00',
    type: 'system',
    date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  }
];