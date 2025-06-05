
import { useMemo } from 'react';
import { Delivery } from '@/types';

export function useDuplicateDeliveryCheck(deliveries: Delivery[]) {
  const duplicateMinuteNumber = useMemo(() => {
    const minuteNumbers = deliveries.map(d => d.minuteNumber).filter(Boolean);
    return minuteNumbers.find((item, index) => minuteNumbers.indexOf(item) !== index);
  }, [deliveries]);

  const checkDuplicateDelivery = (minuteNumber: string): boolean => {
    if (!minuteNumber) return false;
    return deliveries.some(delivery => 
      delivery.minuteNumber === minuteNumber
    );
  };

  return {
    duplicateMinuteNumber,
    checkDuplicateDelivery
  };
}
