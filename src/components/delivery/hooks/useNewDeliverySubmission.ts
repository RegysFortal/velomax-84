
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { toast } from 'sonner';
import { Delivery } from '@/types';
import { generateMinuteNumber } from '@/utils/deliveryUtils';
import { useClients } from '@/contexts';

interface UseNewDeliverySubmissionProps {
  onComplete: () => void;
}

export const useNewDeliverySubmission = ({
  onComplete
}: UseNewDeliverySubmissionProps) => {
  const { addDelivery } = useDeliveries();
  const { clients } = useClients();

  const submitNewDelivery = async (
    newDelivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> 
  ) => {
    try {
      console.log("DeliveryForm - Criando nova entrega:", newDelivery);
      
      // Verificar se há um clientId válido
      if (!newDelivery.clientId) {
        toast.error("Por favor, selecione um cliente");
        return false;
      }
      
      // Verificar se o cliente existe
      const clientExists = clients.some(client => client.id === newDelivery.clientId);
      if (!clientExists) {
        toast.error("Cliente selecionado não é válido");
        return false;
      }
      
      await addDelivery(newDelivery);
      
      toast.success("Entrega registrada com sucesso");
      onComplete();
      
      return true;
    } catch (error) {
      console.error('Error creating delivery:', error);
      toast.error("Erro ao criar entrega");
      return false;
    }
  };

  const generateNewMinuteNumber = (minuteNumber: string, deliveries: Delivery[]) => {
    if (!minuteNumber) {
      return generateMinuteNumber(deliveries);
    }
    return minuteNumber;
  };

  return {
    submitNewDelivery,
    generateNewMinuteNumber
  };
};
