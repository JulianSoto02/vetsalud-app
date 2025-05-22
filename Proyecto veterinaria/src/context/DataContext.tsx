import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAppointments, mockPets, mockMedicalRecords, mockVaccinations } from '../data/mockData';

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  owner: string;
  ownerId: number;
}

export interface Appointment {
  id: number;
  petId: number;
  petName: string;
  ownerName: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface MedicalRecord {
  id: number;
  petId: number;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  veterinarian: string;
}

export interface Vaccination {
  id: number;
  petId: number;
  name: string;
  date: string;
  nextDueDate: string;
  status: 'completed' | 'pending';
}

interface DataContextType {
  pets: Pet[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  vaccinations: Vaccination[];
  addPet: (pet: Omit<Pet, 'id'>) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: number) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: number) => void;
  checkAppointmentConflict: (date: string, time: string, id?: number) => boolean;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  updateMedicalRecord: (record: MedicalRecord) => void;
  deleteMedicalRecord: (id: number) => void;
  addVaccination: (vaccination: Omit<Vaccination, 'id'>) => void;
  updateVaccination: (vaccination: Vaccination) => void;
  deleteVaccination: (id: number) => void;
  getPetById: (id: number) => Pet | undefined;
  getAppointmentsByPetId: (petId: number) => Appointment[];
  getMedicalRecordsByPetId: (petId: number) => MedicalRecord[];
  getVaccinationsByPetId: (petId: number) => Vaccination[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(mockVaccinations);

  // Load data from localStorage if available
  useEffect(() => {
    const storedPets = localStorage.getItem('pets');
    const storedAppointments = localStorage.getItem('appointments');
    const storedMedicalRecords = localStorage.getItem('medicalRecords');
    const storedVaccinations = localStorage.getItem('vaccinations');

    if (storedPets) setPets(JSON.parse(storedPets));
    if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
    if (storedMedicalRecords) setMedicalRecords(JSON.parse(storedMedicalRecords));
    if (storedVaccinations) setVaccinations(JSON.parse(storedVaccinations));
  }, []);

  // Save data to localStorage when changed
  useEffect(() => {
    localStorage.setItem('pets', JSON.stringify(pets));
    localStorage.setItem('appointments', JSON.stringify(appointments));
    localStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));
    localStorage.setItem('vaccinations', JSON.stringify(vaccinations));
  }, [pets, appointments, medicalRecords, vaccinations]);

  // Pets CRUD
  const addPet = (pet: Omit<Pet, 'id'>) => {
    const newPet = { ...pet, id: Date.now() };
    setPets([...pets, newPet]);
  };

  const updatePet = (pet: Pet) => {
    setPets(pets.map(p => p.id === pet.id ? pet : p));
  };

  const deletePet = (id: number) => {
    setPets(pets.filter(p => p.id !== id));
  };

  // Appointments CRUD
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointment, id: Date.now() };
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = (appointment: Appointment) => {
    setAppointments(appointments.map(a => a.id === appointment.id ? appointment : a));
  };

  const deleteAppointment = (id: number) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  // Check for appointment conflicts (same date and time)
  const checkAppointmentConflict = (date: string, time: string, id?: number) => {
    return appointments.some(a => 
      a.date === date && 
      a.time === time && 
      a.status !== 'cancelled' && 
      (!id || a.id !== id)
    );
  };

  // Medical Records CRUD
  const addMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now() };
    setMedicalRecords([...medicalRecords, newRecord]);
  };

  const updateMedicalRecord = (record: MedicalRecord) => {
    setMedicalRecords(medicalRecords.map(r => r.id === record.id ? record : r));
  };

  const deleteMedicalRecord = (id: number) => {
    setMedicalRecords(medicalRecords.filter(r => r.id !== id));
  };

  // Vaccinations CRUD
  const addVaccination = (vaccination: Omit<Vaccination, 'id'>) => {
    const newVaccination = { ...vaccination, id: Date.now() };
    setVaccinations([...vaccinations, newVaccination]);
  };

  const updateVaccination = (vaccination: Vaccination) => {
    setVaccinations(vaccinations.map(v => v.id === vaccination.id ? vaccination : v));
  };

  const deleteVaccination = (id: number) => {
    setVaccinations(vaccinations.filter(v => v.id !== id));
  };

  // Utility functions
  const getPetById = (id: number) => {
    return pets.find(pet => pet.id === id);
  };

  const getAppointmentsByPetId = (petId: number) => {
    return appointments.filter(appointment => appointment.petId === petId);
  };

  const getMedicalRecordsByPetId = (petId: number) => {
    return medicalRecords.filter(record => record.petId === petId);
  };

  const getVaccinationsByPetId = (petId: number) => {
    return vaccinations.filter(vaccination => vaccination.petId === petId);
  };

  return (
    <DataContext.Provider value={{
      pets,
      appointments,
      medicalRecords,
      vaccinations,
      addPet,
      updatePet,
      deletePet,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      checkAppointmentConflict,
      addMedicalRecord,
      updateMedicalRecord,
      deleteMedicalRecord,
      addVaccination,
      updateVaccination,
      deleteVaccination,
      getPetById,
      getAppointmentsByPetId,
      getMedicalRecordsByPetId,
      getVaccinationsByPetId,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};