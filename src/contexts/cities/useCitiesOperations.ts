
import { City } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

export const useCitiesOperations = (
  cities: City[],
  setCities: React.Dispatch<React.SetStateAction<City[]>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();

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

  return {
    addCity,
    updateCity,
    deleteCity,
    getCity
  };
};
