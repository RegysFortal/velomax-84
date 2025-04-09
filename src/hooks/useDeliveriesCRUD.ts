
import { useCallback } from 'react';
import { Delivery } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { useClients } from '@/contexts/ClientsContext';
import { generateMinuteNumber } from '@/utils/deliveryUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

export const useDeliveriesCRUD = (
  deliveries: Delivery[],
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>
) => {
  const { toast } = useToast();
  const { addLog } = useActivityLog();
  const { clients } = useClients();
  const { user } = useAuth();

  const addDelivery = useCallback(async (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Generate a sequential minute number based on the current date if not provided
      let minuteNumber = delivery.minuteNumber;
      if (!minuteNumber) {
        minuteNumber = generateMinuteNumber(deliveries);
      }
      
      // Prepare data for Supabase insert
      const supabaseDelivery = {
        minute_number: minuteNumber,
        client_id: delivery.clientId,
        delivery_date: delivery.deliveryDate,
        delivery_time: delivery.deliveryTime || '',
        receiver: delivery.receiver || '',
        weight: delivery.weight,
        packages: delivery.packages,
        delivery_type: delivery.deliveryType,
        cargo_type: delivery.cargoType,
        cargo_value: delivery.cargoValue || 0,
        total_freight: delivery.totalFreight,
        notes: delivery.notes || '',
        occurrence: delivery.occurrence || '',
        city_id: delivery.cityId || null,
        user_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('deliveries')
        .insert(supabaseDelivery)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Map the returned data to our Delivery type
      const newDelivery: Delivery = {
        id: data.id,
        minuteNumber: data.minute_number,
        clientId: data.client_id,
        deliveryDate: data.delivery_date,
        deliveryTime: data.delivery_time || '',
        receiver: data.receiver || '',
        weight: data.weight,
        packages: data.packages,
        deliveryType: data.delivery_type,
        cargoType: data.cargo_type,
        cargoValue: data.cargo_value || 0,
        totalFreight: data.total_freight,
        notes: data.notes || '',
        occurrence: data.occurrence || '',
        createdAt: data.created_at || timestamp,
        updatedAt: data.updated_at || timestamp,
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
  }, [deliveries, setDeliveries, clients, toast, user]);
  
  const updateDelivery = useCallback(async (id: string, delivery: Partial<Delivery>) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Prepare data for Supabase update
      const supabaseDelivery: any = {
        updated_at: timestamp
      };
      
      // Map properties from delivery to supabaseDelivery
      if (delivery.minuteNumber !== undefined) supabaseDelivery.minute_number = delivery.minuteNumber;
      if (delivery.clientId !== undefined) supabaseDelivery.client_id = delivery.clientId;
      if (delivery.deliveryDate !== undefined) supabaseDelivery.delivery_date = delivery.deliveryDate;
      if (delivery.deliveryTime !== undefined) supabaseDelivery.delivery_time = delivery.deliveryTime;
      if (delivery.receiver !== undefined) supabaseDelivery.receiver = delivery.receiver;
      if (delivery.weight !== undefined) supabaseDelivery.weight = delivery.weight;
      if (delivery.packages !== undefined) supabaseDelivery.packages = delivery.packages;
      if (delivery.deliveryType !== undefined) supabaseDelivery.delivery_type = delivery.deliveryType;
      if (delivery.cargoType !== undefined) supabaseDelivery.cargo_type = delivery.cargoType;
      if (delivery.cargoValue !== undefined) supabaseDelivery.cargo_value = delivery.cargoValue;
      if (delivery.totalFreight !== undefined) supabaseDelivery.total_freight = delivery.totalFreight;
      if (delivery.notes !== undefined) supabaseDelivery.notes = delivery.notes;
      if (delivery.occurrence !== undefined) supabaseDelivery.occurrence = delivery.occurrence;
      if (delivery.cityId !== undefined) supabaseDelivery.city_id = delivery.cityId;
      
      const { error } = await supabase
        .from('deliveries')
        .update(supabaseDelivery)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setDeliveries(prev => 
        prev.map(d => 
          d.id === id 
            ? { ...d, ...delivery, updatedAt: timestamp } 
            : d
        )
      );
      
      toast({
        title: "Entrega atualizada",
        description: `A entrega foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating delivery:', error);
      toast({
        title: "Erro ao atualizar entrega",
        description: "Ocorreu um erro ao atualizar a entrega. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [setDeliveries, toast]);
  
  const deleteDelivery = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
      
      toast({
        title: "Entrega removida",
        description: `A entrega foi removida com sucesso.`,
      });
    } catch (error) {
      console.error('Error deleting delivery:', error);
      toast({
        title: "Erro ao remover entrega",
        description: "Ocorreu um erro ao remover a entrega. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [setDeliveries, toast]);
  
  const getDelivery = useCallback((id: string) => {
    return deliveries.find(delivery => delivery.id === id);
  }, [deliveries]);
  
  return {
    addDelivery,
    updateDelivery,
    deleteDelivery,
    getDelivery
  };
};
