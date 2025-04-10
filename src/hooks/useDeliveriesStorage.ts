
import { useState, useEffect } from 'react';
import { Delivery } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth/AuthContext';

// Initial deliveries data for demo purposes
const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'delivery-1',
    minuteNumber: '001/2023',
    clientId: 'client-1',
    deliveryDate: '2023-05-15',
    deliveryTime: '14:00',
    receiver: 'João Silva',
    weight: 5.5,
    packages: 3,
    deliveryType: 'standard',
    cargoType: 'standard',
    cargoValue: 500,
    totalFreight: 45.5,
    notes: 'Entregar na recepção',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'delivery-2',
    minuteNumber: '002/2023',
    clientId: 'client-2',
    deliveryDate: '2023-05-16',
    deliveryTime: '09:30',
    receiver: 'Farmácia Popular',
    weight: 2.3,
    packages: 2,
    deliveryType: 'emergency',
    cargoType: 'perishable',
    cargoValue: 1200,
    totalFreight: 85.3,
    notes: 'Medicamentos urgentes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useDeliveriesStorage = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load deliveries from Supabase
  useEffect(() => {
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
        
        // Map Supabase data to match our Delivery type with proper type assertions
        const mappedDeliveries = data.map((delivery: any): Delivery => ({
          id: delivery.id,
          minuteNumber: delivery.minute_number,
          clientId: delivery.client_id,
          deliveryDate: delivery.delivery_date,
          deliveryTime: delivery.delivery_time || '',
          receiver: delivery.receiver || '',
          weight: delivery.weight,
          packages: delivery.packages,
          deliveryType: delivery.delivery_type as Delivery['deliveryType'],
          cargoType: delivery.cargo_type as Delivery['cargoType'],
          cargoValue: delivery.cargo_value || 0,
          totalFreight: delivery.total_freight,
          notes: delivery.notes || '',
          occurrence: delivery.occurrence || '',
          createdAt: delivery.created_at || new Date().toISOString(),
          updatedAt: delivery.updated_at || new Date().toISOString(),
          cityId: delivery.city_id || undefined,
          pickupName: delivery.pickup_name || '',
          pickupDate: delivery.pickup_date || '',
          pickupTime: delivery.pickup_time || '',
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
            setDeliveries(JSON.parse(storedDeliveries));
          } catch (error) {
            console.error('Failed to parse stored deliveries', error);
            setDeliveries(INITIAL_DELIVERIES);
          }
        } else {
          setDeliveries(INITIAL_DELIVERIES);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchDeliveries();
    }
  }, [toast, user]);
  
  // Save deliveries to localStorage as backup whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_deliveries', JSON.stringify(deliveries));
    }
  }, [deliveries, loading]);

  return {
    deliveries,
    setDeliveries,
    loading
  };
};
