
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useMetropolitanCities(setFormData: React.Dispatch<React.SetStateAction<any>>) {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const { toast } = useToast();

  const handleToggleMetropolitanCity = useCallback((cityId: string) => {
    setSelectedCities(prev => {
      const isAlreadySelected = prev.includes(cityId);
      const newSelectedCities = isAlreadySelected
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId];
      setFormData(prevFormData => ({
        ...prevFormData,
        metropolitanCityIds: newSelectedCities,
        metropolitanCities: newSelectedCities
      }));
      return newSelectedCities;
    });
  }, [setFormData]);

  const handleCreateNewCity = useCallback((cityName: string) => {
    if (!cityName.trim()) {
      toast({
        title: "Nome inválido",
        description: "Por favor, informe um nome de cidade válido.",
        variant: "destructive"
      });
      return;
    }
  
    const tempId = `temp-${cityName.trim()}`;
  
    if (selectedCities.some(id => id === tempId || (id.startsWith('temp-') && id.replace('temp-', '') === cityName.trim()))) {
      toast({
        title: "Cidade já adicionada",
        description: `A cidade ${cityName} já está na lista.`,
        variant: "destructive"
      });
      return;
    }
    handleToggleMetropolitanCity(tempId);
    toast({
      title: "Cidade adicionada",
      description: `A cidade ${cityName} foi adicionada à região metropolitana.`,
    });
  }, [selectedCities, handleToggleMetropolitanCity, toast]);

  return {
    selectedCities,
    setSelectedCities,
    handleToggleMetropolitanCity,
    handleCreateNewCity
  };
}
