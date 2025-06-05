
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Delivery, DeliveryFormData } from '@/types';

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

      const { data, error } = await supabase
        .from('deliveries')
        .insert({
          minute_number: deliveryData.minuteNumber,
          client_id: deliveryData.clientId,
          delivery_date: deliveryData.deliveryDate,
          delivery_time: deliveryData.deliveryTime,
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
          user_id: user.id
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
        deliveryType: data.delivery_type as any,
        cargoType: data.cargo_type as any,
        cargoValue: data.cargo_value,
        totalFreight: data.total_freight,
        notes: data.notes,
        occurrence: data.occurrence,
        cityId: data.city_id,
        arrivalKnowledgeNumber: data.arrival_knowledge_number,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setDeliveries(prev => [...prev, newDelivery]);
      
      toast({
        title: "Entrega criada",
        description: "A entrega foi criada com sucesso."
      });

      return newDelivery;
    } catch (error) {
      console.error('Error creating delivery:', error);
      toast({
        title: "Erro ao criar entrega",
        description: "Não foi possível criar a entrega. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { addDelivery, loading };
}
