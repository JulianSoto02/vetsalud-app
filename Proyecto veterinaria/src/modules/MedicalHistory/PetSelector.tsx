import React from 'react';
import { Pet } from '../../context/DataContext';

interface PetSelectorProps {
  pets: Pet[];
  selectedPetId: number | null;
  onSelectPet: (petId: number) => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({ pets, selectedPetId, onSelectPet }) => {
  const getPetTypeIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case 'perro':
        return '🐕';
      case 'gato':
        return '🐈';
      case 'ave':
        return '🦜';
      case 'conejo':
        return '🐇';
      case 'reptil':
        return '🦎';
      case 'roedor':
        return '🐹';
      default:
        return '🐾';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Seleccionar Mascota</h3>
      
      {pets.length === 0 ? (
        <p className="text-gray-500">No hay mascotas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {pets.map(pet => (
            <button
              key={pet.id}
              onClick={() => onSelectPet(pet.id)}
              className={`text-left p-3 rounded-md transition-colors flex items-center ${
                selectedPetId === pet.id
                  ? 'bg-teal-100 border-2 border-teal-500'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="text-2xl mr-2" aria-hidden="true">
                {getPetTypeIcon(pet.species)}
              </span>
              <div>
                <p className="font-medium">{pet.name}</p>
                <p className="text-xs text-gray-600">{pet.species} • {pet.breed} • {pet.age} años</p>
                <p className="text-xs text-gray-500">{pet.owner}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetSelector;