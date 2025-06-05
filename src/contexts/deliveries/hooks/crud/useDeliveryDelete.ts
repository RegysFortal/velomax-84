
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Delivery } from '@/types';

export function useDeliveryDelete(setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const deleteDelivery = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('deliveries')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
      
      toast({
        title: "Entrega excluída",
        description: "A entrega foi excluída com sucesso."
      });

      return true;
    } catch (error) {
      console.error('Error deleting delivery:', error);
      toast({
        title: "Erro ao excluir entrega",
        description: "Não foi possível excluir a entrega. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteDelivery, loading };
}
