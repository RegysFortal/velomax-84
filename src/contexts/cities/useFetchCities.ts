
import { useState, useEffect } from 'react';
import { City } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth/AuthContext';
import { INITIAL_CITIES } from './constants';

export const useFetchCities = () => {
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

  return { cities, setCities, loading };
};
