
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Delivery } from '@/types';

export function useDeliveryFetch(
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>
) {
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      console.log('Fetching deliveries from database...');
      
      const { data, error } = await supabase
        .from('deliveries')
        .select('*, clients(name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deliveries:', error);
        throw error;
      }

      console.log('Fetched deliveries from database:', data?.length || 0);

      const formattedDeliveries = data.map((item: any) => ({
        id: item.id,
        clientId: item.client_id,
        clientName: item.clients?.name,
        cityId: item.city_id,
        minuteNumber: item.minute_number,
        packages: item.packages,
        weight: item.weight,
        cargoType: item.cargo_type,
        cargoValue: item.cargo_value,
        deliveryType: item.delivery_type,
        notes: item.notes,
        occurrence: item.occurrence,
        receiver: item.receiver,
        receiverId: item.receiver_id,
        deliveryDate: item.delivery_date,
        deliveryTime: item.delivery_time,
        totalFreight: item.total_freight,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        arrivalKnowledgeNumber: item.arrival_knowledge_number,
      }));
      
      setDeliveries(formattedDeliveries);
      console.log('Successfully loaded deliveries into state:', formattedDeliveries.length);
      return formattedDeliveries;
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast.error('Erro ao buscar entregas');
      
      // Try to load from localStorage as fallback
      try {
        const storedDeliveries = localStorage.getItem('velomax_deliveries');
        if (storedDeliveries) {
          const parsedDeliveries = JSON.parse(storedDeliveries);
          setDeliveries(parsedDeliveries);
          console.log('Loaded deliveries from localStorage as fallback:', parsedDeliveries.length);
          return parsedDeliveries;
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryById = (deliveries: Delivery[], id: string) => {
    return deliveries.find((delivery) => delivery.id === id);
  };

  return {
    loading,
    fetchDeliveries,
    getDeliveryById
  };
}
