
import { useState } from 'react';
import { Delivery, DeliveryFormData } from '@/types/delivery';
import { useShipments } from '@/contexts/shipments';
import { useDuplicateDeliveryCheck } from './useDuplicateDeliveryCheck';

interface UseDeliveryFormSubmitProps {
  deliveries: Delivery[];
  addDelivery: (delivery: DeliveryFormData) => Promise<Delivery>;
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
    showDuplicateAlert, 
    setShowDuplicateAlert: setDuplicateAlert,
    duplicateMinuteNumber, 
    checkDuplicateDelivery 
  } = useDuplicateDeliveryCheck(deliveries);

  const handleSubmit = async (formData: DeliveryFormData) => {
    try {
      setSubmitting(true);

      // Check for duplicate minute number
      if (formData.minuteNumber && checkDuplicateDelivery(formData.minuteNumber)) {
        setFormData(formData);
        return;
      }

      await addDelivery(formData);
      onSuccess();
    } catch (error) {
      console.error('Error submitting delivery:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDuplicate = async (formData: DeliveryFormData) => {
    try {
      setSubmitting(true);
      await addDelivery(formData);
      setDuplicateAlert(false);
      setShowDuplicateAlert(false);
      onSuccess();
    } catch (error) {
      console.error('Error submitting duplicate delivery:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    handleSubmit,
    showDuplicateAlert,
    setShowDuplicateAlert: setDuplicateAlert,
    duplicateMinuteNumber,
    handleConfirmDuplicate
  };
}
