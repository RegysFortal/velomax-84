
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { City } from '@/types';

export function useCitiesData() {
  const [cities, setCities] = useState<City[]>([]);
  
  // Safely get cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        // Try to get cities from localStorage as fallback
        const storedCities = localStorage.getItem('velomax_cities');
        if (storedCities) {
          setCities(JSON.parse(storedCities));
        }
        
        // Try to fetch from Supabase
        const { data } = await supabase.from('cities').select('*');
        if (data && data.length > 0) {
          const formattedCities = data.map((city: any) => ({
            id: city.id,
            name: city.name,
            state: city.state,
            distance: city.distance,
            createdAt: city.created_at,
            updatedAt: city.updated_at
          }));
          setCities(formattedCities);
        }
      } catch (error) {
        console.warn("Error fetching cities:", error);
      }
    };
    
    fetchCities();
  }, []);

  return { cities };
}
