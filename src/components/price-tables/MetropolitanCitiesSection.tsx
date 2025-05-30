import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Input } from '@/components/ui/input';
import { City } from '@/types';

interface MetropolitanCitiesSectionProps {
  selectedCities: string[];
  cities: City[];
  onCityToggle: (cityId: string) => void;
  onCreateNewCity: (cityName: string) => void;
}

export function MetropolitanCitiesSection({
  selectedCities,
  cities,
  onCityToggle,
  onCreateNewCity
}: MetropolitanCitiesSectionProps) {
  const [searchValue, setSearchValue] = useState('');
  const [newCityName, setNewCityName] = useState('');

  const handleAddNewCity = () => {
    if (newCityName.trim()) {
      onCreateNewCity(newCityName.trim());
      setNewCityName('');
    }
  };

  return (
    <div className="border p-4 rounded-md">
      <h3 className="font-medium mb-4 text-lg">Região Metropolitana</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Selecione as cidades que fazem parte da Região Metropolitana. 
        Você pode adicionar cidades da lista ou incluir novas cidades.
      </p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Adicionar Cidade</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Selecionar da lista:</label>
                <SearchableSelect
                  options={cities
                    .filter(city => !selectedCities.includes(city.id))
                    .map(city => ({
                      value: city.id,
                      label: city.name,
                      description: `${city.state} - ${city.distance} km`
                    }))}
                  value={searchValue}
                  onValueChange={(value) => {
                    const city = cities.find(c => c.id === value);
                    if (city) {
                      onCityToggle(city.id);
                      setSearchValue('');
                    }
                  }}
                  placeholder="Buscar cidade..."
                  emptyMessage="Nenhuma cidade encontrada"
                  showCreateOption={true}
                  createOptionLabel="Adicionar cidade"
                  onCreateNew={(cityName) => {
                    if (cityName.trim()) {
                      onCreateNewCity(cityName);
                      setSearchValue('');
                    }
                  }}
                  allowCustomValue={true}
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Incluir nova cidade:</label>
                <div className="flex gap-2">
                  <Input
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    placeholder="Nome da cidade"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newCityName.trim()) {
                        handleAddNewCity();
                        e.preventDefault();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddNewCity}
                    variant="secondary"
                    disabled={!newCityName.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Cidades Selecionadas</h4>
            {selectedCities.length > 0 ? (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {selectedCities.map(cityId => {
                    const city = cities.find(c => c.id === cityId);
                    const cityName = city 
                      ? city.name 
                      : cityId.startsWith('temp-') 
                        ? cityId.replace('temp-', '')
                        : 'Cidade desconhecida';
                    
                    return (
                      <div key={cityId} className="flex items-center justify-between bg-muted/30 p-2 rounded">
                        <span className="text-sm">{cityName}</span>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          onClick={() => onCityToggle(cityId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                Nenhuma cidade selecionada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
