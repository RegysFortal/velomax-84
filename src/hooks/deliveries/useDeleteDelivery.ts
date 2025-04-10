
import { useCallback } from 'react';
import { Delivery } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useDeleteDelivery = (
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>
) => {
  const { toast } = useToast();

  return useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
      
      toast({
        title: "Entrega removida",
        description: `A entrega foi removida com sucesso.`,
      });
    } catch (error) {
      console.error('Error deleting delivery:', error);
      toast({
        title: "Erro ao remover entrega",
        description: "Ocorreu um erro ao remover a entrega. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [setDeliveries, toast]);
};
