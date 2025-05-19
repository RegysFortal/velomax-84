
import { createContext, useContext, ReactNode } from 'react';
import { CitiesContextType } from './types';
import { useFetchCities } from './useFetchCities';
import { useCitiesOperations } from './useCitiesOperations';

const CitiesContext = createContext<CitiesContextType | undefined>(undefined);

export const CitiesProvider = ({ children }: { children: ReactNode }) => {
  const { cities, setCities, loading } = useFetchCities();
  const { addCity, updateCity, deleteCity, getCity } = useCitiesOperations(cities, setCities);
  
  return (
    <CitiesContext.Provider value={{
      cities,
      addCity,
      updateCity,
      deleteCity,
      getCity,
      loading,
    }}>
      {children}
    </CitiesContext.Provider>
  );
};

export const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error('useCities must be used within a CitiesProvider');
  }
  return context;
};
