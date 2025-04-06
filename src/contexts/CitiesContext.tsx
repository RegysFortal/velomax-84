
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { City } from '@/types';
import { useToast } from '@/components/ui/use-toast';

type CitiesContextType = {
  cities: City[];
  addCity: (city: Omit<City, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCity: (id: string, city: Partial<City>) => void;
  deleteCity: (id: string) => void;
  getCity: (id: string) => City | undefined;
  loading: boolean;
};

// Initial cities data for demo purposes
const INITIAL_CITIES: City[] = [
  {
    id: 'city-1',
    name: 'São Paulo',
    state: 'SP',
    distance: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'city-2',
    name: 'Rio de Janeiro',
    state: 'RJ',
    distance: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'city-3',
    name: 'Belo Horizonte',
    state: 'MG',
    distance: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'city-4',
    name: 'Brasília',
    state: 'DF',
    distance: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const CitiesContext = createContext<CitiesContextType | undefined>(undefined);

export const CitiesProvider = ({ children }: { children: ReactNode }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load cities from localStorage or use initial data
    const loadCities = () => {
      const storedCities = localStorage.getItem('velomax_cities');
      if (storedCities) {
        try {
          setCities(JSON.parse(storedCities));
        } catch (error) {
          console.error('Failed to parse stored cities', error);
          setCities(INITIAL_CITIES);
        }
      } else {
        setCities(INITIAL_CITIES);
      }
      setLoading(false);
    };
    
    loadCities();
  }, []);
  
  // Save cities to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_cities', JSON.stringify(cities));
    }
  }, [cities, loading]);
  
  const addCity = (city: Omit<City, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const newCity: City = {
      ...city,
      id: `city-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setCities((prev) => [...prev, newCity]);
    toast({
      title: "Cidade cadastrada",
      description: `A cidade "${city.name}" foi cadastrada com sucesso.`,
    });
  };
  
  const updateCity = (id: string, city: Partial<City>) => {
    setCities((prev) => 
      prev.map((c) => 
        c.id === id 
          ? { ...c, ...city, updatedAt: new Date().toISOString() } 
          : c
      )
    );
    toast({
      title: "Cidade atualizada",
      description: `A cidade foi atualizada com sucesso.`,
    });
  };
  
  const deleteCity = (id: string) => {
    setCities((prev) => prev.filter((city) => city.id !== id));
    toast({
      title: "Cidade removida",
      description: `A cidade foi removida com sucesso.`,
    });
  };
  
  const getCity = (id: string) => {
    return cities.find((city) => city.id === id);
  };
  
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
