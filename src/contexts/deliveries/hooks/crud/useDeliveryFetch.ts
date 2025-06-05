
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Delivery } from '@/types';

export function useDeliveryFetch(setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>) {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const mappedDeliveries = data.map((delivery: any): Delivery => ({
        id: delivery.id,
        minuteNumber: delivery.minute_number,
        clientId: delivery.client_id,
        deliveryDate: delivery.delivery_date,
        deliveryTime: delivery.delivery_time,
        receiver: delivery.receiver,
        receiverId: delivery.receiver_id,
        weight: delivery.weight,
        packages: delivery.packages,
        deliveryType: delivery.delivery_type,
        cargoType: delivery.cargo_type,
        cargoValue: delivery.cargo_value,
        totalFreight: delivery.total_freight,
        notes: delivery.notes,
        occurrence: delivery.occurrence,
        cityId: delivery.city_id,
        arrivalKnowledgeNumber: delivery.arrival_knowledge_number,
        createdAt: delivery.created_at,
        updatedAt: delivery.updated_at
      }));
      
      setDeliveries(mappedDeliveries);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: "Erro ao carregar entregas",
        description: "Usando dados locais como fallback.",
        variant: "destructive"
      });
      
      // Load from localStorage as fallback
      const storedDeliveries = localStorage.getItem('velomax_deliveries');
      if (storedDeliveries) {
        try {
          const parsed = JSON.parse(storedDeliveries);
          setDeliveries(parsed);
        } catch (error) {
          console.error('Failed to parse stored deliveries', error);
          setDeliveries([]);
        }
      } else {
        setDeliveries([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryById = (deliveries: Delivery[], id: string) => {
    return deliveries.find(delivery => delivery.id === id);
  };

  return { loading, fetchDeliveries, getDeliveryById };
}
