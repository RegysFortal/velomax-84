
import { Delivery } from '@/types';
import { useAddDelivery, useUpdateDelivery, useDeleteDelivery, useGetDelivery } from './deliveries';

export const useDeliveriesCRUD = (
  deliveries: Delivery[],
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>
) => {
  const addDelivery = useAddDelivery(deliveries, setDeliveries);
  const updateDelivery = useUpdateDelivery(setDeliveries);
  const deleteDelivery = useDeleteDelivery(setDeliveries);
  const getDelivery = useGetDelivery(deliveries);
  
  return {
    addDelivery,
    updateDelivery,
    deleteDelivery,
    getDelivery
  };
};
