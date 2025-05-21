
import { DeliveryType } from '@/types';
import { doorToDoorDeliveryTypes } from '@/types/delivery';

export function useDeliveryTypes() {
  const isDoorToDoorDelivery = (deliveryType: DeliveryType): boolean => {
    return doorToDoorDeliveryTypes.includes(deliveryType);
  };
  
  const checkMinuteNumberExists = (
    deliveries: any[], 
    minuteNumber: string, 
    clientId: string
  ): boolean => {
    return deliveries.some(delivery => 
      delivery.minuteNumber === minuteNumber && 
      delivery.clientId === clientId
    );
  };

  return {
    isDoorToDoorDelivery,
    checkMinuteNumberExists
  };
}
