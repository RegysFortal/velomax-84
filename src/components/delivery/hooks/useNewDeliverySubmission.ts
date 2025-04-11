
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
      
      // Garantir que o valor do frete seja positivo
      if (!newDelivery.totalFreight || newDelivery.totalFreight <= 0) {
        // Definir um valor padrão em vez de retornar um erro
        newDelivery.totalFreight = 50; // Valor padrão
        console.log("Definindo um valor padrão para o frete:", newDelivery.totalFreight);
      }
      
      // Limpar ou remover campos problemáticos
      // Remover o receiverId se ele estiver causando problemas
      if (typeof newDelivery.receiverId === 'object') {
        delete newDelivery.receiverId;
      }
      
      try {
        await addDelivery(newDelivery);
        
        toast.success("Entrega registrada com sucesso");
        onComplete();
        
        return true;
      } catch (error) {
        console.error('Error creating delivery:', error);
        toast.error("Erro ao criar entrega");
        return false;
      }
    } catch (error) {
      console.error('Error in submitNewDelivery:', error);
      toast.error("Erro ao processar entrega");
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
