
import { useState } from 'react';
import { useDeliveries } from '@/contexts/DeliveriesContext';

export const useDuplicateMinuteCheck = () => {
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const { checkMinuteNumberExists } = useDeliveries();

  const checkForDuplicateMinute = (minuteNumber: string, clientId: string, currentMinuteNumber?: string) => {
    if (minuteNumber && checkMinuteNumberExists(minuteNumber, clientId) && 
        (!currentMinuteNumber || (currentMinuteNumber && currentMinuteNumber !== minuteNumber))) {
      return true;
    }
    return false;
  };

  return {
    showDuplicateAlert,
    setShowDuplicateAlert,
    formData,
    setFormData,
    checkForDuplicateMinute
  };
};
