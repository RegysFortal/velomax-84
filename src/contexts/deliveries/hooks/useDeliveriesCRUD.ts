
import { Delivery } from '@/types';
import { useDeliveryCreate } from './crud/useDeliveryCreate';
import { useDeliveryUpdate } from './crud/useDeliveryUpdate';
import { useDeliveryDelete } from './crud/useDeliveryDelete';
import { useDeliveryFetch } from './crud/useDeliveryFetch';

export function useDeliveriesCRUD(deliveries: Delivery[], setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>) {
  const { addDelivery } = useDeliveryCreate(setDeliveries);
  const { updateDelivery } = useDeliveryUpdate(setDeliveries);
  const { deleteDelivery } = useDeliveryDelete(setDeliveries);
  const { loading, fetchDeliveries, getDeliveryById } = useDeliveryFetch(setDeliveries);

  return {
    loading,
    addDelivery,
    updateDelivery,
    deleteDelivery,
    getDeliveryById: (id: string) => getDeliveryById(deliveries, id),
    fetchDeliveries
  };
}
