import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import PetSelector from './PetSelector';
import MedicalRecordList from './MedicalRecordList';
import VaccinationList from './VaccinationList';
import RecordForm from './RecordForm';
import VaccinationForm from './VaccinationForm';
import { ClipboardList, BedDouble as Needle, Plus } from 'lucide-react';

const MedicalHistory: React.FC = () => {
  const { pets, medicalRecords, vaccinations } = useData();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'records' | 'vaccinations'>('records');
  const [isRecordFormOpen, setIsRecordFormOpen] = useState(false);
  const [isVaccinationFormOpen, setIsVaccinationFormOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [selectedVaccinationId, setSelectedVaccinationId] = useState<number | null>(null);

  const filteredRecords = selectedPetId 
    ? medicalRecords.filter(record => record.petId === selectedPetId)
    : [];

  const filteredVaccinations = selectedPetId
    ? vaccinations.filter(vaccination => vaccination.petId === selectedPetId)
    : [];

  const openRecordForm = (recordId?: number) => {
    setSelectedRecordId(recordId || null);
    setIsRecordFormOpen(true);
  };

  const closeRecordForm = () => {
    setSelectedRecordId(null);
    setIsRecordFormOpen(false);
  };

  const openVaccinationForm = (vaccinationId?: number) => {
    setSelectedVaccinationId(vaccinationId || null);
    setIsVaccinationFormOpen(true);
  };

  const closeVaccinationForm = () => {
    setSelectedVaccinationId(null);
    setIsVaccinationFormOpen(false);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <ClipboardList className="mr-2 h-6 w-6 text-teal-600" />
            Historial Médico
          </h2>
          <p className="text-gray-600">Registros médicos y vacunaciones de las mascotas</p>
        </div>
      </div>

      <div className="mb-6">
        <PetSelector
          pets={pets}
          selectedPetId={selectedPetId}
          onSelectPet={(petId) => setSelectedPetId(petId)}
        />
      </div>

      {selectedPetId && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                  activeTab === 'records'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('records')}
              >
                <span className="flex items-center">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Consultas
                </span>
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                  activeTab === 'vaccinations'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('vaccinations')}
              >
                <span className="flex items-center">
                  <Needle className="h-4 w-4 mr-2" />
                  Vacunaciones
                </span>
              </button>
            </div>
            <button
              onClick={() => activeTab === 'records' ? openRecordForm() : openVaccinationForm()}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200"
            >
              <Plus className="h-5 w-5 mr-1" />
              {activeTab === 'records' ? 'Nueva Consulta' : 'Nueva Vacuna'}
            </button>
          </div>

          {activeTab === 'records' ? (
            <>
              {isRecordFormOpen && (
                <RecordForm
                  petId={selectedPetId}
                  recordId={selectedRecordId}
                  onClose={closeRecordForm}
                />
              )}
              <MedicalRecordList
                records={filteredRecords}
                onEdit={openRecordForm}
              />
            </>
          ) : (
            <>
              {isVaccinationFormOpen && (
                <VaccinationForm
                  petId={selectedPetId}
                  vaccinationId={selectedVaccinationId}
                  onClose={closeVaccinationForm}
                />
              )}
              <VaccinationList
                vaccinations={filteredVaccinations}
                onEdit={openVaccinationForm}
              />
            </>
          )}
        </>
      )}

      {!selectedPetId && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-500">Selecciona una mascota para ver su historial médico.</p>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;