
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
        // Removendo campo receiver_document que estava causando erro
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
      };
      
      console.log("Enviando para Supabase:", supabaseDelivery);
      
      // Insert the delivery into Supabase
      const { data, error } = await supabase
        .from('deliveries')
        .insert(supabaseDelivery)
        .select()
        .single();
      
      if (error) {
        console.error("Erro na inserção:", error);
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
        receiverId: undefined, // Campo removido da tabela
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
        // Adicionando campos que existem em nosso tipo mas não na tabela
        pickupName: '',
        pickupDate: '',
        pickupTime: '',
      };
      
      setDeliveries(prev => [...prev, newDelivery]);
      
      const client = clients.find(c => c.id === delivery.clientId);
      const clientName = client ? (client.tradingName || client.name) : 'Cliente desconhecido';
      
      toast({
        title: "Entrega registrada",
        description: `A entrega ${minuteNumber} foi registrada com sucesso.`,
      });
      
      addLog({
        action: 'create',
        entityType: 'delivery',
        entityId: newDelivery.id,
        entityName: `Minuta ${minuteNumber} - ${clientName}`,
        details: `Nova entrega registrada: ${minuteNumber}`
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
