
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { City } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

type CitiesContextType = {
  cities: City[];
  addCity: (city: Omit<City, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCity: (id: string, city: Partial<City>) => Promise<void>;
  deleteCity: (id: string) => Promise<void>;
  getCity: (id: string) => City | undefined;
  loading: boolean;
};

// Initial cities data for demo purposes - will be used only if fetching fails
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
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        // Map Supabase data to match our City type
        const mappedCities = data.map((city: any): City => ({
          id: city.id,
          name: city.name,
          state: city.state,
          distance: city.distance,
          createdAt: city.created_at || new Date().toISOString(),
          updatedAt: city.updated_at || new Date().toISOString(),
        }));
        
        setCities(mappedCities);
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast({
          title: "Erro ao carregar cidades",
          description: "Usando dados locais como fallback.",
          variant: "destructive"
        });
        
        // Load from localStorage as fallback
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
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchCities();
    }
  }, [toast, user]);
  
  // Save cities to localStorage as a backup
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_cities', JSON.stringify(cities));
    }
  }, [cities, loading]);
  
  const addCity = async (city: Omit<City, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Prepare data for Supabase insert
      const supabaseCity = {
        name: city.name,
        state: city.state,
        distance: city.distance,
        user_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('cities')
        .insert(supabaseCity)
        .select();
      
      if (error) {
        throw error;
      }
      
      // Map the returned data to our City type
      const newCity: City = {
        id: data[0].id,
        name: data[0].name,
        state: data[0].state,
        distance: data[0].distance,
        createdAt: data[0].created_at || timestamp,
        updatedAt: data[0].updated_at || timestamp,
      };
      
      setCities((prev) => [...prev, newCity]);
      
      toast({
        title: "Cidade cadastrada",
        description: `A cidade "${city.name}" foi cadastrada com sucesso.`,
      });
    } catch (error) {
      console.error("Error adding city:", error);
      toast({
        title: "Erro ao adicionar cidade",
        description: "Ocorreu um erro ao adicionar a cidade. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const updateCity = async (id: string, city: Partial<City>) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Prepare data for Supabase update
      const supabaseCity: any = {
        updated_at: timestamp
      };
      
      // Map properties from city to supabaseCity
      if (city.name !== undefined) supabaseCity.name = city.name;
      if (city.state !== undefined) supabaseCity.state = city.state;
      if (city.distance !== undefined) supabaseCity.distance = city.distance;

      const { error } = await supabase
        .from('cities')
        .update(supabaseCity)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setCities((prev) => 
        prev.map((c) => 
          c.id === id 
            ? { ...c, ...city, updatedAt: timestamp } 
            : c
        )
      );
      
      toast({
        title: "Cidade atualizada",
        description: `A cidade foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error("Error updating city:", error);
      toast({
        title: "Erro ao atualizar cidade",
        description: "Ocorreu um erro ao atualizar a cidade. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const deleteCity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setCities((prev) => prev.filter((city) => city.id !== id));
      
      toast({
        title: "Cidade removida",
        description: `A cidade foi removida com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting city:", error);
      toast({
        title: "Erro ao remover cidade",
        description: "Ocorreu um erro ao remover a cidade. Tente novamente.",
        variant: "destructive"
      });
    }
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
