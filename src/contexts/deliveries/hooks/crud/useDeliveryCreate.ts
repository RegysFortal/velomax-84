
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Delivery, DeliveryFormData, DeliveryType, CargoType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function useDeliveryCreate(setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addDelivery = async (deliveryData: DeliveryFormData): Promise<Delivery | undefined> => {
    try {
      setLoading(true);

      // Get current user for user_id field
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const deliveryId = uuidv4();
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('deliveries')
        .insert({
          id: deliveryId,
          minute_number: deliveryData.minuteNumber || '',
          client_id: deliveryData.clientId,
          delivery_date: deliveryData.deliveryDate,
          delivery_time: deliveryData.deliveryTime || '',
          receiver: deliveryData.receiver,
          receiver_id: deliveryData.receiverId,
          weight: deliveryData.weight,
          packages: deliveryData.packages,
          delivery_type: deliveryData.deliveryType,
          cargo_type: deliveryData.cargoType,
          cargo_value: deliveryData.cargoValue,
          total_freight: deliveryData.totalFreight,
          notes: deliveryData.notes,
          occurrence: deliveryData.occurrence,
          city_id: deliveryData.cityId,
          arrival_knowledge_number: deliveryData.arrivalKnowledgeNumber,
          user_id: user.id,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newDelivery: Delivery = {
        id: data.id,
        minuteNumber: data.minute_number,
        clientId: data.client_id,
        deliveryDate: data.delivery_date,
        deliveryTime: data.delivery_time,
        receiver: data.receiver,
        receiverId: data.receiver_id,
        weight: data.weight,
        packages: data.packages,
        deliveryType: data.delivery_type as DeliveryType,
        cargoType: data.cargo_type as CargoType,
        cargoValue: data.cargo_value,
        totalFreight: data.total_freight,
        notes: data.notes,
        occurrence: data.occurrence,
        cityId: data.city_id,
        arrivalKnowledgeNumber: data.arrival_knowledge_number,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isCourtesy: deliveryData.isCourtesy,
        hasCustomPrice: deliveryData.hasCustomPrice
      };

      // Update deliveries list immediately
      setDeliveries(prev => [newDelivery, ...prev]);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('deliveries-updated', { 
        detail: { type: 'create', delivery: newDelivery } 
      }));
      
      toast({
        title: "Entrega criada com sucesso",
        description: `Minuta ${newDelivery.minuteNumber} foi criada.`
      });

      return newDelivery;
    } catch (error) {
      console.error('Error creating delivery:', error);
      toast({
        title: "Erro ao criar entrega",
        description: "Tente novamente ou contate o suporte.",
        variant: "destructive"
      });
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return {
    addDelivery,
    loading
  };
}
