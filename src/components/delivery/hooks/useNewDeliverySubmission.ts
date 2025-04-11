
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { toast } from 'sonner';
import { Delivery } from '@/types';
import { generateMinuteNumber } from '@/utils/deliveryUtils';
import { useClients } from '@/contexts';
import { useAuth } from '@/contexts/auth/AuthContext';

interface UseNewDeliverySubmissionProps {
  onComplete: () => void;
}

export const useNewDeliverySubmission = ({
  onComplete
}: UseNewDeliverySubmissionProps) => {
  const { addDelivery } = useDeliveries();
  const { clients } = useClients();
  const { user, hasPermission } = useAuth();

  const submitNewDelivery = async (
    newDelivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> 
  ) => {
    try {
      console.log("DeliveryForm - Criando nova entrega:", newDelivery);
      
      // Check for deliveries permission
      if (!hasPermission('deliveries')) {
        toast.error("Você não tem permissão para criar entregas");
        return false;
      }
      
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
      
      // Convert form values to proper types
      const formattedDelivery = {
        ...newDelivery,
        weight: parseFloat(String(newDelivery.weight)),
        packages: parseInt(String(newDelivery.packages)),
        cargoValue: newDelivery.cargoValue ? parseFloat(String(newDelivery.cargoValue)) : 0,
        user_id: user?.id // Add current user ID to the delivery
      };
      
      try {
        console.log("Submitting delivery to database:", formattedDelivery);
        const result = await addDelivery(formattedDelivery);
        
        if (result && result.error) {
          throw new Error(result.error.message || "Erro ao criar entrega");
        }
        
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
