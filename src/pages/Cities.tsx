
import { useState } from 'react';
import { City } from '@/types';
import { useCities } from '@/contexts/cities';
import { CitiesHeader } from '@/components/cities/CitiesHeader';
import { CityTable } from '@/components/cities/CityTable';
import { CityEditDialog } from '@/components/cities/CityEditDialog';

export default function Cities() {
  const { cities, addCity, updateCity, deleteCity } = useCities();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | undefined>(undefined);
  
  const handleAddCity = (data: { name: string; state: string; distance: number }) => {
    addCity({
      name: data.name,
      state: data.state,
      distance: data.distance
    });
  };
  
  const handleEditClick = (city: City) => {
    setSelectedCity(city);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateCity = (data: { name: string; state: string; distance: number }) => {
    if (selectedCity) {
      updateCity(selectedCity.id, {
        name: data.name,
        state: data.state,
        distance: data.distance
      });
      setIsEditDialogOpen(false);
    }
  };
  
  const handleDeleteClick = (city: City) => {
    if (window.confirm(`Tem certeza que deseja excluir a cidade "${city.name}"?`)) {
      deleteCity(city.id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <CitiesHeader onAddCity={handleAddCity} />
      <CityTable 
        cities={cities}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      <CityEditDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedCity={selectedCity}
        onUpdateCity={handleUpdateCity}
      />
    </div>
  );
}
