import { Delivery, DeliveryType, CargoType } from '@/types';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useActivityLogging } from './useActivityLogging';
import { useNewDeliverySubmission } from './useNewDeliverySubmission';
import { useDeliverySubmission } from './useDeliverySubmission';
import { useDuplicateMinuteCheck } from './useDuplicateMinuteCheck';
import { toast } from 'sonner';

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
  const { checkMinuteNumberExists } = useDeliveries();
  const { logDeliveryUpdate, logDeliveryCreation, getClientName } = useActivityLogging();
  const { submitNewDelivery, generateNewMinuteNumber } = useNewDeliverySubmission({ onComplete });
  const { submitUpdatedDelivery } = useDeliverySubmission({ isEditMode, delivery, onComplete });

  const handleSubmit = (data: any, freight: number) => {
    try {
      console.log("DeliveryForm - Dados do formulário enviado:", data);
      console.log("DeliveryForm - Valor do frete:", freight);
      
      if (!data.clientId) {
        toast.error("Por favor, selecione um cliente");
        return;
      }
      
      const weight = parseFloat(data.weight);
      const packages = parseInt(data.packages);
      const cargoValue = data.cargoValue ? parseFloat(data.cargoValue) : undefined;
      
      const clientName = getClientName(data.clientId);
      
      console.log("DeliveryForm - Cliente selecionado:", clientName);
      
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
            deliveryType: data.deliveryType as DeliveryType,
            cargoType: data.cargoType as CargoType,
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
            deliveryType: data.deliveryType as DeliveryType,
            cargoType: data.cargoType as CargoType,
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
          deliveryType: data.deliveryType as DeliveryType,
          cargoType: data.cargoType as CargoType,
          cargoValue,
          totalFreight: freight,
          notes: data.notes,
          occurrence: data.occurrence,
          cityId: data.cityId || undefined,
          pickupName: data.pickupName,
          pickupDate: data.pickupDate,
          pickupTime: data.pickupTime,
        };
        
        submitUpdatedDelivery(updatedDelivery, delivery.id);
        logDeliveryUpdate(delivery, data.clientId);
      } 
      else {
        let minuteNumber = generateNewMinuteNumber(data.minuteNumber, []);
        
        const newDelivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> = {
          minuteNumber,
          clientId: data.clientId,
          deliveryDate: data.deliveryDate,
          deliveryTime: data.deliveryTime,
          receiver: data.receiver,
          weight,
          packages,
          deliveryType: data.deliveryType as DeliveryType,
          cargoType: data.cargoType as CargoType,
          cargoValue,
          totalFreight: freight,
          notes: data.notes,
          occurrence: data.occurrence,
          cityId: data.cityId || undefined,
          pickupName: data.pickupName,
          pickupDate: data.pickupDate,
          pickupTime: data.pickupTime,
        };
        
        submitNewDelivery(newDelivery);
        logDeliveryCreation(minuteNumber, data.clientId);
      }
    } catch (error) {
      console.error('Error submitting delivery form:', error);
    }
  };

  const handleConfirmDuplicate = (formData: any) => {
    if (!formData) return;
    
    try {
      if (isEditMode && delivery) {
        submitUpdatedDelivery(formData.updatedDelivery, delivery.id);
        logDeliveryUpdate(delivery, formData.updatedDelivery.clientId);
      } else if (formData.newDelivery) {
        submitNewDelivery(formData.newDelivery);
        logDeliveryCreation(formData.newDelivery.minuteNumber, formData.newDelivery.clientId);
      }
      
      setShowDuplicateAlert(false);
    } catch (error) {
      console.error('Error submitting delivery form:', error);
    }
  };

  return {
    handleSubmit,
    handleConfirmDuplicate
  };
};
