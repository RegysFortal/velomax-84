
import { useCallback } from 'react';
import { Delivery } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { useClients } from '@/contexts';
import { generateMinuteNumber } from '@/utils/delivery';
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

  return useCallback(async (delivery: DeliveryCreateInput) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Generate a sequential minute number based on the current date if not provided
      let minuteNumber = delivery.minuteNumber;
      if (!minuteNumber) {
        minuteNumber = generateMinuteNumber(deliveries);
      }
      
      // Prepare data for Supabase insert using the correct field names for Supabase schema
      const supabaseDelivery: any = {
        minute_number: minuteNumber,
        client_id: delivery.clientId,
        delivery_date: delivery.deliveryDate,
        delivery_time: delivery.deliveryTime || '',
        receiver: delivery.receiver || '',
        receiver_id: delivery.receiverId || '', // Adicionado: ID do recebedor
        weight: parseFloat(delivery.weight.toString()), // Ensure weight is a number
        packages: parseInt(delivery.packages.toString()), // Ensure packages is a number
        delivery_type: delivery.deliveryType,
        cargo_type: delivery.cargoType,
        cargo_value: delivery.cargoValue ? parseFloat(delivery.cargoValue.toString()) : 0,
        total_freight: delivery.totalFreight || 50, // Ensure there's always a freight value
        notes: delivery.notes || '',
        occurrence: delivery.occurrence || '',
        city_id: delivery.cityId || null,
        user_id: user?.id,
        arrival_knowledge_number: delivery.arrivalKnowledgeNumber || '', // Adicionado: Número de conhecimento
      };
      
      // Handle invoice numbers
      if (delivery.invoiceNumbers && delivery.invoiceNumbers.length > 0) {
        // Add invoice numbers to notes field
        const invoiceList = delivery.invoiceNumbers.join(', ');
        supabaseDelivery.notes = `${supabaseDelivery.notes} Notas Fiscais: ${invoiceList}`.trim();
      }
      
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
        receiverId: responseData.receiver_id, // Adicionado: ID do recebedor
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
        // Adding fields that exist in our type but not in the table
        pickupName: '',
        pickupDate: '',
        pickupTime: '',
        arrivalKnowledgeNumber: responseData.arrival_knowledge_number || '', // Adicionado: Número de conhecimento
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
