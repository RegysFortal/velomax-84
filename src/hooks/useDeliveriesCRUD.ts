
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
  
  // Mock fetch function that returns the current deliveries
  // In a real application, this would fetch from an API or database
  const fetchDeliveries = async (): Promise<Delivery[]> => {
    // Return the current deliveries from state
    // This is a placeholder - in a real app, you'd fetch from an API
    console.log("Fetching deliveries...");
    return deliveries;
  };
  
  return {
    addDelivery,
    updateDelivery,
    deleteDelivery,
    getDelivery,
    loading: false,
    getDeliveryById: getDelivery,
    fetchDeliveries
  };
};
