
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Delivery, DeliveryType, CargoType, City } from '@/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { calculateFreight as utilsCalculateFreight, isDoorToDoorDelivery as checkIfDoorToDoor, checkMinuteNumberExists as checkMinuteExists } from '@/utils/deliveryUtils';
import { PriceTable } from '@/types';
import { usePriceTables } from '@/contexts';

interface DeliveriesContextType {
  deliveries: Delivery[];
  loading: boolean;
  addDelivery: (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Delivery>;
  updateDelivery: (id: string, delivery: Partial<Delivery>) => Promise<void>;
  deleteDelivery: (id: string) => Promise<void>;
  getDeliveryById: (id: string) => Delivery | undefined;
  calculateFreight: (
    clientId: string,
    weight: number,
    deliveryType: DeliveryType,
    cargoType: CargoType,
    cargoValue?: number,
    distance?: number,
    cityId?: string
  ) => number;
  isDoorToDoorDelivery: (deliveryType: DeliveryType) => boolean;
  checkMinuteNumberExists: (minuteNumber: string, clientId: string) => boolean;
}

const DeliveriesContext = createContext<DeliveriesContextType | undefined>(undefined);

export function useDeliveries() {
  const context = useContext(DeliveriesContext);
  if (!context) {
    throw new Error("useDeliveries must be used within a DeliveriesProvider");
  }
  return context;
}

export function DeliveriesProvider({ children }: { children: ReactNode }) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { priceTables } = usePriceTables();
  
  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('deliveries')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        const mappedDeliveries = data.map(delivery => ({
          id: delivery.id,
          minuteNumber: delivery.minute_number,
          clientId: delivery.client_id,
          deliveryDate: delivery.delivery_date,
          deliveryTime: delivery.delivery_time,
          receiver: delivery.receiver,
          weight: delivery.weight,
          packages: delivery.packages,
          deliveryType: delivery.delivery_type as DeliveryType,
          cargoType: delivery.cargo_type as CargoType,
          totalFreight: delivery.total_freight,
          notes: delivery.notes,
          occurrence: delivery.occurrence,
          cargoValue: delivery.cargo_value,
          cityId: delivery.city_id,
          createdAt: delivery.created_at,
          updatedAt: delivery.updated_at
        }));
        
        setDeliveries(mappedDeliveries);
      } catch (error) {
        console.error("Error loading deliveries:", error);
        toast.error("Failed to load deliveries");
      } finally {
        setLoading(false);
      }
    };
    
    loadDeliveries();
  }, [user]);

  // Improved addDelivery function to properly sync with Supabase
  const addDelivery = async (deliveryData: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>): Promise<Delivery> => {
    try {
      console.log("Adding delivery with data:", deliveryData);
      
      // Prepare data for Supabase insert
      const supabaseDelivery = {
        id: deliveryData.id || uuidv4(),
        minute_number: deliveryData.minuteNumber,
        client_id: deliveryData.clientId,
        delivery_date: deliveryData.deliveryDate,
        delivery_time: deliveryData.deliveryTime,
        receiver: deliveryData.receiver,
        weight: deliveryData.weight,
        packages: deliveryData.packages,
        delivery_type: deliveryData.deliveryType,
        cargo_type: deliveryData.cargoType || 'standard',
        total_freight: deliveryData.totalFreight,
        notes: deliveryData.notes,
        occurrence: deliveryData.occurrence,
        cargo_value: deliveryData.cargoValue,
        city_id: deliveryData.cityId,
        // Add user_id to ensure it passes RLS policies
        user_id: user?.id
      };
      
      console.log("Supabase delivery data:", supabaseDelivery);
      
      // Insert into Supabase
      const { data: newDelivery, error } = await supabase
        .from('deliveries')
        .insert(supabaseDelivery)
        .select()
        .single();
        
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      console.log("Supabase response:", newDelivery);
      
      // Map from Supabase format to our app format
      const mappedDelivery: Delivery = {
        id: newDelivery.id,
        minuteNumber: newDelivery.minute_number,
        clientId: newDelivery.client_id,
        deliveryDate: newDelivery.delivery_date,
        deliveryTime: newDelivery.delivery_time,
        receiver: newDelivery.receiver,
        weight: newDelivery.weight,
        packages: newDelivery.packages,
        deliveryType: newDelivery.delivery_type as DeliveryType,
        cargoType: newDelivery.cargo_type as CargoType,
        totalFreight: newDelivery.total_freight,
        notes: newDelivery.notes,
        occurrence: newDelivery.occurrence,
        cargoValue: newDelivery.cargo_value,
        cityId: newDelivery.city_id,
        createdAt: newDelivery.created_at,
        updatedAt: newDelivery.updated_at
      };
      
      // Also update local state
      setDeliveries(prev => [mappedDelivery, ...prev]);
      
      toast.success('Entrega adicionada com sucesso');
      return mappedDelivery;
    } catch (error) {
      console.error('Error adding delivery:', error);
      toast.error('Erro ao adicionar entrega');
      throw error;
    }
  };

  const updateDelivery = async (id: string, delivery: Partial<Delivery>) => {
    try {
      const supabaseDelivery: any = {};
      
      if (delivery.minuteNumber !== undefined) supabaseDelivery.minute_number = delivery.minuteNumber;
      if (delivery.clientId !== undefined) supabaseDelivery.client_id = delivery.clientId;
      if (delivery.deliveryDate !== undefined) supabaseDelivery.delivery_date = delivery.deliveryDate;
      if (delivery.deliveryTime !== undefined) supabaseDelivery.delivery_time = delivery.deliveryTime;
      if (delivery.receiver !== undefined) supabaseDelivery.receiver = delivery.receiver;
      if (delivery.weight !== undefined) supabaseDelivery.weight = delivery.weight;
      if (delivery.packages !== undefined) supabaseDelivery.packages = delivery.packages;
      if (delivery.deliveryType !== undefined) supabaseDelivery.delivery_type = delivery.deliveryType;
      if (delivery.cargoType !== undefined) supabaseDelivery.cargo_type = delivery.cargoType;
      if (delivery.totalFreight !== undefined) supabaseDelivery.total_freight = delivery.totalFreight;
      if (delivery.notes !== undefined) supabaseDelivery.notes = delivery.notes;
      if (delivery.occurrence !== undefined) supabaseDelivery.occurrence = delivery.occurrence;
      if (delivery.cargoValue !== undefined) supabaseDelivery.cargo_value = delivery.cargoValue;
      if (delivery.cityId !== undefined) supabaseDelivery.city_id = delivery.cityId;
      
      const { error } = await supabase
        .from('deliveries')
        .update(supabaseDelivery)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setDeliveries(prevDeliveries =>
        prevDeliveries.map(prevDelivery =>
          prevDelivery.id === id ? { ...prevDelivery, ...delivery } : prevDelivery
        )
      );
      
      toast.success('Entrega atualizada com sucesso');
    } catch (error) {
      console.error('Error updating delivery:', error);
      toast.error('Erro ao atualizar entrega');
    }
  };

  const deleteDelivery = async (id: string) => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setDeliveries(prevDeliveries =>
        prevDeliveries.filter(delivery => delivery.id !== id)
      );
      
      toast.success('Entrega excluída com sucesso');
    } catch (error) {
      console.error('Error deleting delivery:', error);
      toast.error('Erro ao excluir entrega');
    }
  };

  const getDeliveryById = (id: string): Delivery | undefined => {
    return deliveries.find(delivery => delivery.id === id);
  };
  
  // Add the missing functions that were referenced in hooks
  const calculateFreight = (
    clientId: string,
    weight: number,
    deliveryType: DeliveryType,
    cargoType: CargoType,
    cargoValue?: number,
    distance?: number,
    cityId?: string
  ): number => {
    try {
      const defaultPriceTable = priceTables.length > 0 ? priceTables[0] : undefined;
      return utilsCalculateFreight(
        defaultPriceTable,
        weight,
        deliveryType,
        cargoType,
        cargoValue,
        distance
      );
    } catch (error) {
      console.error('Error calculating freight:', error);
      return 50; // Default fallback value
    }
  };
  
  const isDoorToDoorDelivery = (deliveryType: DeliveryType): boolean => {
    return checkIfDoorToDoor(deliveryType);
  };
  
  const checkMinuteNumberExists = (minuteNumber: string, clientId: string): boolean => {
    return checkMinuteExists(deliveries, minuteNumber, clientId);
  };
  
  return (
    <DeliveriesContext.Provider value={{
      deliveries,
      loading,
      addDelivery,
      updateDelivery,
      deleteDelivery,
      getDeliveryById,
      calculateFreight,
      isDoorToDoorDelivery,
      checkMinuteNumberExists
    }}>
      {children}
    </DeliveriesContext.Provider>
  );
}
