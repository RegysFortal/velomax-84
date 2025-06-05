
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Delivery } from '@/types';

export function useDeliveryUpdate(setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateDelivery = async (id: string, updates: Partial<Delivery>): Promise<Delivery | undefined> => {
    try {
      setLoading(true);

      const updateData: any = {};
      
      if (updates.minuteNumber !== undefined) updateData.minute_number = updates.minuteNumber;
      if (updates.clientId !== undefined) updateData.client_id = updates.clientId;
      if (updates.deliveryDate !== undefined) updateData.delivery_date = updates.deliveryDate;
      if (updates.deliveryTime !== undefined) updateData.delivery_time = updates.deliveryTime;
      if (updates.receiver !== undefined) updateData.receiver = updates.receiver;
      if (updates.receiverId !== undefined) updateData.receiver_id = updates.receiverId;
      if (updates.weight !== undefined) updateData.weight = updates.weight;
      if (updates.packages !== undefined) updateData.packages = updates.packages;
      if (updates.deliveryType !== undefined) updateData.delivery_type = updates.deliveryType;
      if (updates.cargoType !== undefined) updateData.cargo_type = updates.cargoType;
      if (updates.cargoValue !== undefined) updateData.cargo_value = updates.cargoValue;
      if (updates.totalFreight !== undefined) updateData.total_freight = updates.totalFreight;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.occurrence !== undefined) updateData.occurrence = updates.occurrence;
      if (updates.cityId !== undefined) updateData.city_id = updates.cityId;
      if (updates.arrivalKnowledgeNumber !== undefined) updateData.arrival_knowledge_number = updates.arrivalKnowledgeNumber;

      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('deliveries')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === id 
            ? { ...delivery, ...updates, updatedAt: updateData.updated_at }
            : delivery
        )
      );

      toast({
        title: "Entrega atualizada",
        description: "A entrega foi atualizada com sucesso."
      });

      const updatedDelivery = { ...updates, updatedAt: updateData.updated_at } as Delivery;
      return updatedDelivery;
    } catch (error) {
      console.error('Error updating delivery:', error);
      toast({
        title: "Erro ao atualizar entrega",
        description: "Não foi possível atualizar a entrega. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateDelivery, loading };
}
