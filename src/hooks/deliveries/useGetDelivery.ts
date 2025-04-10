
import { useCallback } from 'react';
import { Delivery } from '@/types';

export const useGetDelivery = (deliveries: Delivery[]) => {
  return useCallback((id: string) => {
    return deliveries.find(delivery => delivery.id === id);
  }, [deliveries]);
};
