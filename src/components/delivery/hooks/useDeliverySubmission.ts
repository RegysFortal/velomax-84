
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { toast } from 'sonner';
import { Delivery } from '@/types';

interface UseDeliverySubmissionProps {
  isEditMode: boolean;
  delivery: Delivery | null | undefined;
  onComplete: () => void;
}

export const useDeliverySubmission = ({
  isEditMode,
  delivery,
  onComplete
}: UseDeliverySubmissionProps) => {
  const { updateDelivery } = useDeliveries();

  const submitUpdatedDelivery = async (
    updatedDelivery: Partial<Delivery>,
    deliveryId: string
  ) => {
    try {
      console.log("DeliveryForm - Atualizando entrega:", updatedDelivery);
      
      await updateDelivery(deliveryId, updatedDelivery);
      
      toast.success("Entrega atualizada com sucesso");
      onComplete();
      
      return true;
    } catch (error) {
      console.error('Error updating delivery:', error);
      toast.error("Erro ao atualizar entrega");
      return false;
    }
  };

  return {
    submitUpdatedDelivery
  };
};
