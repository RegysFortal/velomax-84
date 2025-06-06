
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
      
      // Converter cargoValue para número garantindo que seja sempre um número
      let cargoValue = 0;
      if (delivery.cargoValue !== undefined && delivery.cargoValue !== null) {
        if (typeof delivery.cargoValue === 'string') {
          cargoValue = delivery.cargoValue ? parseFloat(delivery.cargoValue) : 0;
        } else if (typeof delivery.cargoValue === 'number') {
          cargoValue = delivery.cargoValue;
        }
      }
      
      console.log('Valor da carga convertido:', cargoValue, 'Tipo:', typeof cargoValue);
      console.log('Data de entrega recebida:', delivery.deliveryDate);
      console.log('Hora de entrega recebida:', delivery.deliveryTime);
      
      // Validar formato da data (deve estar em yyyy-MM-dd)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(delivery.deliveryDate)) {
        console.error('Data em formato incorreto:', delivery.deliveryDate);
        throw new Error('Data deve estar no formato yyyy-MM-dd');
      }
      
      // Prepare data for Supabase insert using the correct field names for Supabase schema
      const supabaseDelivery: any = {
        minute_number: minuteNumber,
        client_id: delivery.clientId,
        delivery_date: delivery.deliveryDate, // Manter exatamente como recebido (formato yyyy-MM-dd)
        delivery_time: delivery.deliveryTime || null, // null se vazio
        receiver: delivery.receiver || '',
        receiver_id: delivery.receiverId || '',
        weight: parseFloat(delivery.weight.toString()),
        packages: parseInt(delivery.packages.toString()),
        delivery_type: delivery.deliveryType,
        cargo_type: delivery.cargoType,
        cargo_value: cargoValue, // Sempre será um número
        total_freight: delivery.totalFreight || 50,
        notes: delivery.notes || '',
        occurrence: delivery.occurrence || '',
        city_id: delivery.cityId || null,
        user_id: user?.id,
        arrival_knowledge_number: delivery.arrivalKnowledgeNumber || '',
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
        receiverId: responseData.receiver_id,
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
        arrivalKnowledgeNumber: responseData.arrival_knowledge_number || '',
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
