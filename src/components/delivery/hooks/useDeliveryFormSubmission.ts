
import { useState } from 'react';
import { toast } from 'sonner';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { Delivery, CargoType } from '@/types';

interface UseDeliveryFormSubmissionProps {
  delivery: Delivery | null | undefined;
  isEditMode: boolean;
  onComplete: () => void;
  checkMinuteNumberExistsForClient: (minuteNumber: string, clientId: string, excludeId?: string) => boolean;
  setFormData: (data: any) => void;
  setShowDuplicateAlert: (show: boolean) => void;
  freight: number;
}

export const useDeliveryFormSubmission = ({
  delivery,
  isEditMode,
  onComplete,
  checkMinuteNumberExistsForClient,
  setFormData,
  setShowDuplicateAlert,
  freight
}: UseDeliveryFormSubmissionProps) => {
  const { addDelivery, updateDelivery } = useDeliveries();
  const [submitting, setSubmitting] = useState(false);

  const validateFormData = (data: any) => {
    if (!data.clientId) {
      toast.error('Por favor, selecione um cliente');
      return false;
    }
    
    if (!data.deliveryDate) {
      toast.error('Por favor, informe a data de entrega');
      return false;
    }
    
    if (!data.receiver?.trim()) {
      toast.error('Por favor, informe o destinatário');
      return false;
    }

    const weight = typeof data.weight === 'string' ? parseFloat(data.weight) : data.weight;
    if (!weight || weight <= 0) {
      toast.error('Por favor, informe um peso válido maior que 0');
      return false;
    }

    const packages = typeof data.packages === 'string' ? parseInt(data.packages) : data.packages;
    if (!packages || packages <= 0) {
      toast.error('Por favor, informe a quantidade de volumes válida maior que 0');
      return false;
    }

    return true;
  };

  const checkDuplicateMinute = (data: any) => {
    if (!isEditMode || (delivery && delivery.minuteNumber !== data.minuteNumber)) {
      if (data.minuteNumber && checkMinuteNumberExistsForClient(data.minuteNumber, data.clientId, delivery?.id)) {
        setFormData(data);
        setShowDuplicateAlert(true);
        return true;
      }
    }
    return false;
  };

  const prepareDeliveryData = (data: any) => {
    const weight = typeof data.weight === 'string' ? parseFloat(data.weight) : data.weight;
    const packages = typeof data.packages === 'string' ? parseInt(data.packages) : data.packages;

    return {
      ...data,
      cargoType: 'standard' as CargoType,
      totalFreight: data.isCourtesy ? 0 : (freight || data.totalFreight || 50),
      weight: weight,
      packages: packages,
      cargoValue: data.cargoValue ? parseFloat(String(data.cargoValue)) : 0,
      isCourtesy: data.isCourtesy || false,
    };
  };

  const submitDelivery = async (data: any) => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      console.log('Submitting delivery data:', data);
      console.log('Is Edit Mode:', isEditMode);
      console.log('Delivery ID:', delivery?.id);
      
      if (!validateFormData(data)) return;
      if (checkDuplicateMinute(data)) return;
      
      const deliveryData = prepareDeliveryData(data);
      
      if (isEditMode && delivery?.id) {
        console.log('Updating existing delivery with ID:', delivery.id);
        const result = await updateDelivery(delivery.id, deliveryData);
        if (result) {
          toast.success('Entrega atualizada com sucesso');
          onComplete();
        } else {
          toast.error('Erro ao atualizar entrega');
        }
      } else {
        console.log('Creating new delivery');
        const result = await addDelivery(deliveryData);
        if (result) {
          toast.success('Entrega registrada com sucesso');
          onComplete();
        } else {
          toast.error('Erro ao registrar entrega');
        }
      }
    } catch (error) {
      console.error('Error submitting delivery:', error);
      toast.error('Erro ao salvar entrega');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDuplicate = async (formData: any) => {
    if (formData && !submitting) {
      try {
        setSubmitting(true);
        
        const deliveryData = prepareDeliveryData(formData);
        
        if (isEditMode && delivery?.id) {
          const result = await updateDelivery(delivery.id, deliveryData);
          if (result) {
            toast.success('Entrega atualizada com sucesso');
            onComplete();
          }
        } else {
          const result = await addDelivery(deliveryData);
          if (result) {
            toast.success('Entrega registrada com sucesso');
            onComplete();
          }
        }
        
        setShowDuplicateAlert(false);
      } catch (error) {
        console.error('Error submitting duplicate delivery:', error);
        toast.error('Erro ao salvar entrega');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return {
    submitting,
    submitDelivery,
    handleConfirmDuplicate
  };
};
