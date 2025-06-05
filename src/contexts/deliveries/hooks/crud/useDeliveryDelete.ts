
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Delivery } from '@/types';

export function useDeliveryDelete(
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>
) {
  const deleteDelivery = async (id: string) => {
    try {
      console.log('Deleting delivery from database:', id);

      const { error } = await supabase.from('deliveries').delete().eq('id', id);

      if (error) throw error;

      setDeliveries((prevDeliveries) => {
        const updatedDeliveries = prevDeliveries.filter((delivery) => delivery.id !== id);
        localStorage.setItem('velomax_deliveries', JSON.stringify(updatedDeliveries));
        return updatedDeliveries;
      });
      
      console.log('Successfully deleted delivery from database and state');
      toast.success('Entrega excluída com sucesso');
      return true;
    } catch (error) {
      console.error('Error deleting delivery:', error);
      toast.error('Erro ao excluir entrega');
      return false;
    }
  };

  return { deleteDelivery };
}
