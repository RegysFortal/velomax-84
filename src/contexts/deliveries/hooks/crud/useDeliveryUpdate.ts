
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Delivery, CargoType, DeliveryType } from '@/types';

export function useDeliveryUpdate(
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>
) {
  const updateDelivery = async (id: string, data: Partial<Delivery>) => {
    try {
      console.log('Updating delivery in database with ID:', id);
      console.log('Original data received:', data);

      // Prepare the update data with proper field mapping
      const supabaseData: any = {
        updated_at: new Date().toISOString(),
      };

      // Map each field properly
      if (data.clientId !== undefined) supabaseData.client_id = data.clientId;
      if (data.cityId !== undefined) supabaseData.city_id = data.cityId;
      if (data.minuteNumber !== undefined) supabaseData.minute_number = data.minuteNumber;
      if (data.packages !== undefined) supabaseData.packages = data.packages;
      if (data.weight !== undefined) supabaseData.weight = data.weight;
      if (data.cargoType !== undefined) supabaseData.cargo_type = data.cargoType;
      if (data.cargoValue !== undefined) supabaseData.cargo_value = data.cargoValue;
      if (data.deliveryType !== undefined) supabaseData.delivery_type = data.deliveryType;
      if (data.notes !== undefined) supabaseData.notes = data.notes;
      if (data.occurrence !== undefined) supabaseData.occurrence = data.occurrence;
      if (data.receiver !== undefined) supabaseData.receiver = data.receiver;
      if (data.receiverId !== undefined) supabaseData.receiver_id = data.receiverId;
      if (data.deliveryDate !== undefined) supabaseData.delivery_date = data.deliveryDate;
      if (data.deliveryTime !== undefined) supabaseData.delivery_time = data.deliveryTime;
      if (data.arrivalKnowledgeNumber !== undefined) supabaseData.arrival_knowledge_number = data.arrivalKnowledgeNumber;

      // Handle totalFreight with proper processing for manual values
      if (data.totalFreight !== undefined) {
        let freightValue: number = 0;
        
        const freightInput = data.totalFreight as number | string;
        
        if (typeof freightInput === 'number') {
          freightValue = freightInput;
        } else if (typeof freightInput === 'string') {
          const cleanValue = freightInput
            .replace(/[R$\s]/g, '')
            .replace(/\./g, '')
            .replace(/,/, '.');
          
          freightValue = parseFloat(cleanValue);
          
          if (isNaN(freightValue)) {
            freightValue = 0;
            console.warn('Could not parse totalFreight value:', freightInput, 'defaulting to 0');
          }
        } else {
          freightValue = Number(freightInput) || 0;
          console.warn('Unexpected totalFreight type:', typeof freightInput, 'converted to:', freightValue);
        }
        
        supabaseData.total_freight = freightValue;
        console.log('Freight processing - Original:', freightInput, 'Processed:', freightValue);
      }

      console.log('Final Supabase update data:', supabaseData);

      const { data: updatedData, error } = await supabase
        .from('deliveries')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating delivery in Supabase:', error);
        throw error;
      }

      console.log('Successfully updated delivery in database:', updatedData);

      // Map the response back to our format
      const updatedDelivery: Delivery = {
        id: updatedData.id,
        clientId: updatedData.client_id,
        cityId: updatedData.city_id,
        minuteNumber: updatedData.minute_number,
        packages: updatedData.packages,
        weight: updatedData.weight,
        cargoType: updatedData.cargo_type as CargoType,
        cargoValue: updatedData.cargo_value,
        deliveryType: updatedData.delivery_type as DeliveryType,
        notes: updatedData.notes,
        occurrence: updatedData.occurrence,
        receiver: updatedData.receiver,
        receiverId: updatedData.receiver_id,
        deliveryDate: updatedData.delivery_date,
        deliveryTime: updatedData.delivery_time,
        totalFreight: updatedData.total_freight,
        createdAt: updatedData.created_at,
        updatedAt: updatedData.updated_at,
        arrivalKnowledgeNumber: updatedData.arrival_knowledge_number,
      };

      // Update the local state
      setDeliveries((prevDeliveries) => {
        const updatedDeliveries = prevDeliveries.map((delivery) =>
          delivery.id === id ? { ...delivery, ...updatedDelivery } : delivery
        );
        localStorage.setItem('velomax_deliveries', JSON.stringify(updatedDeliveries));
        console.log('Updated delivery in local state with totalFreight:', updatedDelivery.totalFreight);
        return updatedDeliveries;
      });

      console.log('Successfully updated delivery in state');
      toast.success('Entrega atualizada com sucesso');
      return updatedDelivery;
    } catch (error) {
      console.error('Error updating delivery:', error);
      toast.error('Erro ao atualizar entrega');
      return undefined;
    }
  };

  return { updateDelivery };
}
