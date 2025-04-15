
import { useCallback } from 'react';
import { Delivery } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useUpdateDelivery = (
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>
) => {
  const { toast } = useToast();

  return useCallback(async (id: string, updates: Partial<Delivery>): Promise<void> => {
    try {
      const timestamp = new Date().toISOString();
      
      // Prepare data for Supabase update
      const supabaseDelivery: any = {
        updated_at: timestamp
      };
      
      // Map properties from delivery to supabaseDelivery
      if (updates.minuteNumber !== undefined) supabaseDelivery.minute_number = updates.minuteNumber;
      if (updates.clientId !== undefined) supabaseDelivery.client_id = updates.clientId;
      if (updates.deliveryDate !== undefined) supabaseDelivery.delivery_date = updates.deliveryDate;
      if (updates.deliveryTime !== undefined) supabaseDelivery.delivery_time = updates.deliveryTime;
      if (updates.receiver !== undefined) supabaseDelivery.receiver = updates.receiver;
      if (updates.receiverId !== undefined) supabaseDelivery.receiver_document = updates.receiverId;
      if (updates.weight !== undefined) supabaseDelivery.weight = updates.weight;
      if (updates.packages !== undefined) supabaseDelivery.packages = updates.packages;
      if (updates.deliveryType !== undefined) supabaseDelivery.delivery_type = updates.deliveryType;
      if (updates.cargoType !== undefined) supabaseDelivery.cargo_type = updates.cargoType;
      if (updates.cargoValue !== undefined) supabaseDelivery.cargo_value = updates.cargoValue;
      if (updates.totalFreight !== undefined) {
        // Ensure totalFreight is a number by converting it properly
        const freightValue = typeof updates.totalFreight === 'string' 
          ? parseFloat(updates.totalFreight.replace ? updates.totalFreight.replace(',', '.') : updates.totalFreight) 
          : updates.totalFreight;
        
        supabaseDelivery.total_freight = freightValue;
      }
      if (updates.notes !== undefined) supabaseDelivery.notes = updates.notes;
      if (updates.occurrence !== undefined) supabaseDelivery.occurrence = updates.occurrence;
      if (updates.cityId !== undefined) supabaseDelivery.city_id = updates.cityId;
      if (updates.pickupName !== undefined) supabaseDelivery.pickup_person = updates.pickupName;
      if (updates.pickupDate !== undefined) supabaseDelivery.pickup_date = updates.pickupDate;
      if (updates.pickupTime !== undefined) supabaseDelivery.pickup_time = updates.pickupTime;
      
      console.log('Updating delivery with:', supabaseDelivery);
      
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
            ? { ...d, ...updates, updatedAt: timestamp } 
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
};
