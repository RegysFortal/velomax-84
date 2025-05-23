
import { useState } from 'react';
import { Delivery, DeliveryFormData } from '@/types/delivery';
import { useDuplicateDeliveryCheck } from './useDuplicateDeliveryCheck';
import { toast } from 'sonner';

interface UseDeliveryFormSubmitProps {
  deliveries: Delivery[];
  addDelivery: (delivery: DeliveryFormData) => Promise<Delivery | undefined>;
  onSuccess: () => void;
  isEditMode?: boolean;
  delivery?: Delivery | null;
  setFormData?: (data: DeliveryFormData) => void;
  setShowDuplicateAlert?: (show: boolean) => void;
}

export function useDeliveryFormSubmit({
  deliveries,
  addDelivery,
  onSuccess,
  isEditMode = false,
  delivery = null,
  setFormData = () => {},
  setShowDuplicateAlert = () => {}
}: UseDeliveryFormSubmitProps) {
  const [submitting, setSubmitting] = useState(false);
  const { 
    duplicateMinuteNumber, 
    checkDuplicateDelivery 
  } = useDuplicateDeliveryCheck(deliveries);

  const handleSubmit = async (formData: DeliveryFormData) => {
    if (submitting) return;
    
    try {
      setSubmitting(true);

      // Check for duplicate minute number only for new deliveries
      if (!isEditMode && formData.minuteNumber && checkDuplicateDelivery(formData.minuteNumber)) {
        setFormData(formData);
        setShowDuplicateAlert(true);
        return;
      }

      const result = await addDelivery(formData);
      if (result) {
        toast.success(isEditMode ? 'Entrega atualizada com sucesso' : 'Entrega registrada com sucesso');
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting delivery:', error);
      toast.error('Erro ao salvar entrega');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDuplicate = async (formData: DeliveryFormData) => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      const result = await addDelivery(formData);
      if (result) {
        setShowDuplicateAlert(false);
        toast.success('Entrega registrada com sucesso');
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting duplicate delivery:', error);
      toast.error('Erro ao salvar entrega');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    handleSubmit,
    duplicateMinuteNumber,
    handleConfirmDuplicate
  };
}
