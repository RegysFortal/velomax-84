
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { Delivery } from '@/types';
import { toast } from 'sonner';
import { generateMinuteNumber } from '@/utils/deliveryUtils';

interface UseDeliveryFormSubmitProps {
  isEditMode: boolean;
  delivery: Delivery | null | undefined;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setShowDuplicateAlert: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete: () => void;
}

export const useDeliveryFormSubmit = ({
  isEditMode,
  delivery,
  setFormData,
  setShowDuplicateAlert,
  onComplete
}: UseDeliveryFormSubmitProps) => {
  const { addDelivery, updateDelivery, checkMinuteNumberExists } = useDeliveries();
  const { clients } = useClients();
  const { addLog } = useActivityLog();

  const handleSubmit = (data: any, freight: number) => {
    try {
      console.log("DeliveryForm - Dados do formulário enviado:", data);
      
      const weight = parseFloat(data.weight);
      const packages = parseInt(data.packages);
      const cargoValue = data.cargoValue ? parseFloat(data.cargoValue) : undefined;
      
      const client = clients.find(c => c.id === data.clientId);
      const clientName = client ? (client.tradingName || client.name) : 'Cliente desconhecido';
      
      console.log("DeliveryForm - Cliente selecionado:", client);
      
      if (data.minuteNumber && checkMinuteNumberExists(data.minuteNumber, data.clientId) && 
          (!isEditMode || (isEditMode && delivery && delivery.minuteNumber !== data.minuteNumber))) {
        
        if (isEditMode && delivery) {
          const updatedDelivery: Partial<Delivery> = {
            clientId: data.clientId,
            deliveryDate: data.deliveryDate,
            deliveryTime: data.deliveryTime,
            receiver: data.receiver,
            weight,
            packages,
            deliveryType: data.deliveryType as Delivery['deliveryType'],
            cargoType: data.cargoType as Delivery['cargoType'],
            cargoValue,
            totalFreight: freight,
            notes: data.notes,
            occurrence: data.occurrence,
            cityId: data.cityId || undefined,
            pickupName: data.pickupName,
            pickupDate: data.pickupDate,
            pickupTime: data.pickupTime,
          };
          
          setFormData({
            updatedDelivery,
            clientName
          });
        } else {
          const newDelivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> = {
            minuteNumber: data.minuteNumber || '',
            clientId: data.clientId,
            deliveryDate: data.deliveryDate,
            deliveryTime: data.deliveryTime,
            receiver: data.receiver,
            weight,
            packages,
            deliveryType: data.deliveryType as Delivery['deliveryType'],
            cargoType: data.cargoType as Delivery['cargoType'],
            cargoValue,
            totalFreight: freight,
            notes: data.notes,
            occurrence: data.occurrence,
            cityId: data.cityId || undefined,
            pickupName: data.pickupName,
            pickupDate: data.pickupDate,
            pickupTime: data.pickupTime,
          };
          
          setFormData({
            newDelivery,
            clientName
          });
        }
        
        setShowDuplicateAlert(true);
        return;
      }
      
      if (isEditMode && delivery) {
        const updatedDelivery: Partial<Delivery> = {
          clientId: data.clientId,
          deliveryDate: data.deliveryDate,
          deliveryTime: data.deliveryTime,
          receiver: data.receiver,
          weight,
          packages,
          deliveryType: data.deliveryType as Delivery['deliveryType'],
          cargoType: data.cargoType as Delivery['cargoType'],
          cargoValue,
          totalFreight: freight,
          notes: data.notes,
          occurrence: data.occurrence,
          cityId: data.cityId || undefined,
          pickupName: data.pickupName,
          pickupDate: data.pickupDate,
          pickupTime: data.pickupTime,
        };
        
        console.log("DeliveryForm - Atualizando entrega:", updatedDelivery);
        
        updateDelivery(delivery.id, updatedDelivery);
        
        addLog({
          action: 'update',
          entityType: 'delivery',
          entityId: delivery.id,
          entityName: `Minuta ${delivery.minuteNumber} - ${clientName}`,
          details: `Entrega atualizada: ${delivery.minuteNumber}`
        });
        
        toast.success("Entrega atualizada com sucesso");
      } else {
        let minuteNumber = data.minuteNumber;
        if (!minuteNumber) {
          // This assumes that generateMinuteNumber is now imported from utils
          // instead of being called from the context
          minuteNumber = generateMinuteNumber([]);
        }
        
        const newDelivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> = {
          minuteNumber,
          clientId: data.clientId,
          deliveryDate: data.deliveryDate,
          deliveryTime: data.deliveryTime,
          receiver: data.receiver,
          weight,
          packages,
          deliveryType: data.deliveryType as Delivery['deliveryType'],
          cargoType: data.cargoType as Delivery['cargoType'],
          cargoValue,
          totalFreight: freight,
          notes: data.notes,
          occurrence: data.occurrence,
          cityId: data.cityId || undefined,
          pickupName: data.pickupName,
          pickupDate: data.pickupDate,
          pickupTime: data.pickupTime,
        };
        
        console.log("DeliveryForm - Criando nova entrega:", newDelivery);
        
        addDelivery(newDelivery);
        
        addLog({
          action: 'create',
          entityType: 'delivery',
          entityId: '',
          entityName: `Nova entrega - ${clientName}`,
          details: `Nova entrega criada para ${clientName}`
        });
        
        toast.success("Entrega registrada com sucesso");
      }
      
      onComplete();
    } catch (error) {
      console.error('Error submitting delivery form:', error);
      toast.error("Erro ao salvar entrega");
    }
  };

  const handleConfirmDuplicate = (formData: any) => {
    if (!formData) return;
    
    try {
      if (isEditMode && delivery) {
        updateDelivery(delivery.id, formData.updatedDelivery);
        
        addLog({
          action: 'update',
          entityType: 'delivery',
          entityId: delivery.id,
          entityName: `Minuta ${delivery.minuteNumber} - ${formData.clientName}`,
          details: `Entrega atualizada: ${delivery.minuteNumber}`
        });
        
        toast.success("Entrega atualizada com sucesso");
      } else {
        addDelivery(formData.newDelivery);
        
        addLog({
          action: 'create',
          entityType: 'delivery',
          entityId: '',
          entityName: `Nova entrega - ${formData.clientName}`,
          details: `Nova entrega criada para ${formData.clientName}`
        });
        
        toast.success("Entrega registrada com sucesso");
      }
      
      setShowDuplicateAlert(false);
      onComplete();
    } catch (error) {
      console.error('Error submitting delivery form:', error);
      toast.error("Erro ao salvar entrega");
    }
  };

  return {
    handleSubmit,
    handleConfirmDuplicate
  };
};
