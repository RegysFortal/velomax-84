
import { useCallback } from 'react';
import { Delivery } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { useClients } from '@/contexts';
import { generateMinuteNumber } from '@/utils/deliveryUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { DeliveryCreateInput, DeliveryResponse } from './types';

export const useAddDelivery = (
  deliveries: Delivery[],
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>
) => {
  const { toast } = useToast();
  const { addLog } = useActivityLog();
  const { clients } = useClients();
  const { user } = useAuth();

  return useCallback(async (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Generate a sequential minute number based on the current date if not provided
      let minuteNumber = delivery.minuteNumber;
      if (!minuteNumber) {
        minuteNumber = generateMinuteNumber(deliveries);
      }
      
      // Prepare data for Supabase insert using the correct field names for Supabase schema
      const supabaseDelivery = {
        minute_number: minuteNumber,
        client_id: delivery.clientId,
        delivery_date: delivery.deliveryDate,
        delivery_time: delivery.deliveryTime || '',
        receiver: delivery.receiver || '',
        receiver_document: delivery.receiverId || null, // Using receiver_document for Supabase
        weight: delivery.weight,
        packages: delivery.packages,
        delivery_type: delivery.deliveryType,
        cargo_type: delivery.cargoType,
        cargo_value: delivery.cargoValue || 0,
        total_freight: delivery.totalFreight,
        notes: delivery.notes || '',
        occurrence: delivery.occurrence || '',
        city_id: delivery.cityId || null,
        user_id: user?.id,
        pickup_person: delivery.pickupName || '', // Using pickup_person for Supabase
        pickup_date: delivery.pickupDate || '',
        pickup_time: delivery.pickupTime || '',
      };
      
      // Insert the delivery into Supabase
      const { data, error } = await supabase
        .from('deliveries')
        .insert(supabaseDelivery)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Map the returned data to our Delivery type with proper field mappings
      const responseData = data as DeliveryResponse;
      const newDelivery: Delivery = {
        id: responseData.id,
        minuteNumber: responseData.minute_number,
        clientId: responseData.client_id,
        deliveryDate: responseData.delivery_date,
        deliveryTime: responseData.delivery_time || '',
        receiver: responseData.receiver || '',
        receiverId: responseData.receiver_document || undefined, // Map from receiver_document to receiverId
        weight: responseData.weight,
        packages: responseData.packages,
        deliveryType: responseData.delivery_type as Delivery['deliveryType'],
        cargoType: responseData.cargo_type as Delivery['cargoType'],
        cargoValue: responseData.cargo_value || 0,
        totalFreight: responseData.total_freight,
        notes: responseData.notes || '',
        occurrence: responseData.occurrence || '',
        createdAt: responseData.created_at || timestamp,
        updatedAt: responseData.updated_at || timestamp,
        cityId: responseData.city_id || undefined,
        pickupName: responseData.pickup_person || '', // Map from pickup_person to pickupName
        pickupDate: responseData.pickup_date || '',
        pickupTime: responseData.pickup_time || '',
      };
      
      setDeliveries(prev => [...prev, newDelivery]);
      
      const client = clients.find(c => c.id === delivery.clientId);
      const clientName = client ? (client.tradingName || client.name) : 'Cliente desconhecido';
      
      toast({
        title: "Entrega registrada",
        description: `A entrega ${minuteNumber} foi registrada com sucesso.`,
      });
      
      return newDelivery;
    } catch (error) {
      console.error("Error adding delivery:", error);
      toast({
        title: "Erro ao registrar entrega",
        description: "Ocorreu um erro ao registrar a entrega. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  }, [deliveries, setDeliveries, clients, toast, user, addLog]);
};
