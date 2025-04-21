
import { Delivery, DeliveryType, doorToDoorDeliveryTypes } from '@/types/delivery';

/**
 * Check if a delivery type is a door-to-door delivery
 */
export const isDoorToDoorDelivery = (deliveryType: DeliveryType): boolean => {
  return doorToDoorDeliveryTypes.includes(deliveryType);
};

/**
 * Check if a delivery type is an exclusive delivery
 */
export const isExclusiveDelivery = (deliveryType: Delivery['deliveryType']): boolean => {
  return deliveryType === 'exclusive';
};
