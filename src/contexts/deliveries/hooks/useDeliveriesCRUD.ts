
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Delivery, DeliveryFormData, CargoType, DeliveryType } from '@/types';

export function useDeliveriesCRUD(deliveries: Delivery[], setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>) {
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      console.log('Fetching deliveries from database...');
      
      const { data, error } = await supabase
        .from('deliveries')
        .select('*, clients(name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deliveries:', error);
        throw error;
      }

      console.log('Fetched deliveries from database:', data?.length || 0);

      const formattedDeliveries = data.map((item: any) => ({
        id: item.id,
        clientId: item.client_id,
        clientName: item.clients?.name,
        cityId: item.city_id,
        minuteNumber: item.minute_number,
        packages: item.packages,
        weight: item.weight,
        cargoType: item.cargo_type,
        cargoValue: item.cargo_value,
        deliveryType: item.delivery_type,
        notes: item.notes,
        occurrence: item.occurrence,
        receiver: item.receiver,
        receiverId: item.receiver_id,
        deliveryDate: item.delivery_date,
        deliveryTime: item.delivery_time,
        totalFreight: item.total_freight,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        arrivalKnowledgeNumber: item.arrival_knowledge_number,
      }));
      
      setDeliveries(formattedDeliveries);
      console.log('Successfully loaded deliveries into state:', formattedDeliveries.length);
      return formattedDeliveries;
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast.error('Erro ao buscar entregas');
      
      // Try to load from localStorage as fallback
      try {
        const storedDeliveries = localStorage.getItem('velomax_deliveries');
        if (storedDeliveries) {
          const parsedDeliveries = JSON.parse(storedDeliveries);
          setDeliveries(parsedDeliveries);
          console.log('Loaded deliveries from localStorage as fallback:', parsedDeliveries.length);
          return parsedDeliveries;
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

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

      // Handle totalFreight with explicit type checking
      if (data.totalFreight !== undefined) {
        let freightValue: number = 0;
        const freightInput: string | number = data.totalFreight;
        
        if (typeof freightInput === 'string') {
          // Clean the string: remove currency symbols, spaces, and handle comma as decimal separator
          const cleanValue = freightInput
            .replace(/[R$\s]/g, '') // Remove R$, spaces
            .replace(/\./g, '') // Remove thousand separators (dots)
            .replace(/,/, '.'); // Replace decimal comma with dot
          
          freightValue = parseFloat(cleanValue);
          
          if (isNaN(freightValue)) {
            freightValue = 0;
            console.warn('Could not parse totalFreight value:', freightInput, 'defaulting to 0');
          }
        } else if (typeof freightInput === 'number') {
          freightValue = freightInput;
        } else {
          freightValue = 0;
          console.warn('Unexpected totalFreight type:', typeof freightInput, 'defaulting to 0');
        }
        
        supabaseData.total_freight = freightValue;
        console.log('Freight conversion - Original:', freightInput, 'Converted:', freightValue);
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

  const deleteDelivery = async (id: string) => {
    try {
      console.log('Deleting delivery from database:', id);

      const { error } = await supabase.from('deliveries').delete().eq('id', id);

      if (error) throw error;

      setDeliveries((prevDeliveries) => {
        const updatedDeliveries = prevDeliveries.filter((delivery) => delivery.id !== id);
        localStorage.setItem('velomax_deliveries', JSON.stringify(updatedDeliveries));
        return updatedDeliveries;
      });
      
      console.log('Successfully deleted delivery from database and state');
      toast.success('Entrega excluída com sucesso');
      return true;
    } catch (error) {
      console.error('Error deleting delivery:', error);
      toast.error('Erro ao excluir entrega');
      return false;
    }
  };

  const getDeliveryById = (id: string) => {
    return deliveries.find((delivery) => delivery.id === id);
  };

  return {
    loading,
    addDelivery,
    updateDelivery,
    deleteDelivery,
    getDeliveryById,
    fetchDeliveries
  };
}
