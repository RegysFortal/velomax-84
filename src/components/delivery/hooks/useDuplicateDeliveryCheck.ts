
import { Delivery } from '@/types';
import { useState } from 'react';

export function useDuplicateDeliveryCheck(deliveries: Delivery[]) {
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [duplicateMinuteNumber, setDuplicateMinuteNumber] = useState<string>('');

  const checkDuplicateDelivery = (minuteNumber: string): boolean => {
    // Skip check if no minute number provided
    if (!minuteNumber) return false;

    // Check if there's an existing delivery with the same minute number
    const isDuplicate = deliveries.some(
      delivery => delivery.minuteNumber.toLowerCase() === minuteNumber.toLowerCase()
    );

    if (isDuplicate) {
      setDuplicateMinuteNumber(minuteNumber);
      setShowDuplicateAlert(true);
      return true;
    }

    return false;
  };

  return {
    showDuplicateAlert,
    setShowDuplicateAlert,
    duplicateMinuteNumber,
    checkDuplicateDelivery
  };
}
