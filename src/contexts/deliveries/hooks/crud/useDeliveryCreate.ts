
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Delivery, DeliveryFormData } from '@/types';

export function useDeliveryCreate(
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>
) {
  const addDelivery = async (deliveryData: DeliveryFormData) => {
    try {
      const totalFreight = typeof deliveryData.totalFreight === 'string' 
        ? parseFloat(deliveryData.totalFreight) 
        : deliveryData.totalFreight;

      console.log('Adding new delivery to database:', deliveryData);

      const deliveryRecord = {
        id: uuidv4(),
        client_id: deliveryData.clientId,
        city_id: deliveryData.cityId,
        minute_number: deliveryData.minuteNumber,
        packages: deliveryData.packages,
        weight: deliveryData.weight,
        cargo_type: deliveryData.cargoType,
        cargo_value: deliveryData.cargoValue,
        delivery_type: deliveryData.deliveryType,
        notes: deliveryData.notes,
        occurrence: deliveryData.occurrence,
        receiver: deliveryData.receiver,
        receiver_id: deliveryData.receiverId,
        delivery_date: deliveryData.deliveryDate,
        delivery_time: deliveryData.deliveryTime,
        total_freight: totalFreight || 0,
        arrival_knowledge_number: deliveryData.arrivalKnowledgeNumber,
      };

      const { data, error } = await supabase
        .from('deliveries')
        .insert(deliveryRecord)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
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
        receiverId: data.receiver_id,
        weight: data.weight,
        packages: data.packages,
        deliveryType: data.delivery_type as Delivery['deliveryType'],
        cargoType: data.cargo_type as Delivery['cargoType'],
        cargoValue: data.cargo_value || 0,
        totalFreight: data.total_freight,
        notes: data.notes || '',
        occurrence: data.occurrence || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        cityId: data.city_id || undefined,
        arrivalKnowledgeNumber: data.arrival_knowledge_number || '',
      };

      setDeliveries((prevDeliveries) => {
        const updatedDeliveries = [newDelivery, ...prevDeliveries];
        localStorage.setItem('velomax_deliveries', JSON.stringify(updatedDeliveries));
        return updatedDeliveries;
      });
      
      console.log('Successfully added new delivery to database and state');
      toast.success('Entrega criada com sucesso');

      return newDelivery;
    } catch (error) {
      console.error('Error adding delivery:', error);
      toast.error(`Erro ao adicionar entrega: ${error.message || 'Erro desconhecido'}`);
      return undefined;
    }
  };

  return { addDelivery };
}
