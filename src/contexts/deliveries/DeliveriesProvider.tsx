import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DeliveryType, CargoType, doorToDoorDeliveryTypes, DeliveryFormData } from '@/types/delivery';
import { calculateFreight as utilsCalculateFreight } from '@/utils/delivery';
import type { Delivery, City } from '@/types';
import { DeliveriesContext } from './DeliveriesContext';
import { useClientPriceTable } from '@/contexts/budget/useClientPriceTable';

// These imports will be handled safely with fallbacks
let cities: City[] = [];
let priceTables = [];

export const DeliveriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Safely get the required hooks
  let getClientPriceTable = (clientId: string) => undefined;
  
  try {
    const clientPriceTableHook = useClientPriceTable();
    getClientPriceTable = clientPriceTableHook.getClientPriceTable;
  } catch (error) {
    console.warn("useClientPriceTable not available, using fallback");
  }

  // Safely get cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        // Try to get cities from localStorage as fallback
        const storedCities = localStorage.getItem('velomax_cities');
        if (storedCities) {
          cities = JSON.parse(storedCities);
        }
        
        // Try to fetch from Supabase
        const { data } = await supabase.from('cities').select('*');
        if (data && data.length > 0) {
          cities = data.map((city: any) => ({
            id: city.id,
            name: city.name,
            state: city.state,
            distance: city.distance,
            createdAt: city.created_at,
            updatedAt: city.updated_at
          }));
        }
      } catch (error) {
        console.warn("Error fetching cities:", error);
      }
    };
    
    fetchCities();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deliveries')
        .select('*, clients(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

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
        deliveryDate: item.delivery_date,
        deliveryTime: item.delivery_time,
        totalFreight: item.total_freight,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
      setDeliveries(formattedDeliveries);
      return formattedDeliveries;
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast.error('Erro ao buscar entregas');
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
      const { data, error } = await supabase
        .from('deliveries')
        .insert({
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
          delivery_date: deliveryData.deliveryDate,
          delivery_time: deliveryData.deliveryTime,
          total_freight: totalFreight || 0,
        })
        .select()
        .single();

      if (error) throw error;

      const newDelivery: Delivery = {
        id: data.id,
        clientId: data.client_id,
        cityId: data.city_id,
        minuteNumber: data.minute_number,
        packages: data.packages,
        weight: data.weight,
        cargoType: data.cargo_type as CargoType,
        cargoValue: data.cargo_value,
        deliveryType: data.delivery_type as DeliveryType,
        notes: data.notes,
        occurrence: data.occurrence,
        receiver: data.receiver,
        deliveryDate: data.delivery_date,
        deliveryTime: data.delivery_time,
        totalFreight: data.total_freight,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setDeliveries((prevDeliveries) => [newDelivery, ...prevDeliveries]);

      return newDelivery;
    } catch (error) {
      console.error('Error adding delivery:', error);
      toast.error('Erro ao adicionar entrega');
      return undefined;
    }
  };

  const updateDelivery = async (id: string, data: Partial<Delivery>) => {
    try {
      let totalFreightValue = 0;
      if (data.totalFreight !== undefined) {
        totalFreightValue = typeof data.totalFreight === 'string' 
          ? parseFloat(data.totalFreight) 
          : data.totalFreight;
      }

      const supabaseData: any = {
        client_id: data.clientId,
        city_id: data.cityId,
        minute_number: data.minuteNumber,
        packages: data.packages,
        weight: data.weight,
        cargo_type: data.cargoType,
        cargo_value: data.cargoValue,
        delivery_type: data.deliveryType,
        notes: data.notes,
        occurrence: data.occurrence,
        receiver: data.receiver,
        delivery_date: data.deliveryDate,
        delivery_time: data.deliveryTime,
        total_freight: data.totalFreight !== undefined ? totalFreightValue : undefined,
      };

      Object.keys(supabaseData).forEach(
        (key) => supabaseData[key] === undefined && delete supabaseData[key]
      );

      const { data: updatedData, error } = await supabase
        .from('deliveries')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

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
        deliveryDate: updatedData.delivery_date,
        deliveryTime: updatedData.delivery_time,
        totalFreight: updatedData.total_freight,
        createdAt: updatedData.created_at,
        updatedAt: updatedData.updated_at,
      };

      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.id === id ? { ...delivery, ...updatedDelivery } : delivery
        )
      );

      return updatedDelivery;
    } catch (error) {
      console.error('Error updating delivery:', error);
      toast.error('Erro ao atualizar entrega');
      return undefined;
    }
  };

  const deleteDelivery = async (id: string) => {
    try {
      const { error } = await supabase.from('deliveries').delete().eq('id', id);

      if (error) throw error;

      setDeliveries((prevDeliveries) =>
        prevDeliveries.filter((delivery) => delivery.id !== id)
      );
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

  const createDeliveriesFromShipment = async (shipment: any, deliveryDetails: any) => {
    try {
      if (!shipment || !deliveryDetails || !deliveryDetails.selectedDocumentIds || deliveryDetails.selectedDocumentIds.length === 0) {
        return;
      }
      const selectedDocs = shipment.documents.filter((doc: any) => 
        deliveryDetails.selectedDocumentIds.includes(doc.id)
      );
      if (selectedDocs.length === 0) {
        return;
      }
      for (const doc of selectedDocs) {
        const deliveryWeight = doc.weight || shipment.weight || 0;
        const baseFreight = calculateFreight(
          shipment.companyId,
          deliveryWeight,
          'standard' as DeliveryType,
          'standard' as CargoType
        );
        const newDelivery: DeliveryFormData = {
          clientId: shipment.companyId,
          minuteNumber: doc.minuteNumber || "",
          packages: doc.packages || 1,
          weight: deliveryWeight,
          cargoType: 'standard' as CargoType,
          deliveryType: 'standard' as DeliveryType,
          receiver: deliveryDetails.receiverName,
          deliveryDate: deliveryDetails.deliveryDate,
          deliveryTime: deliveryDetails.deliveryTime,
          totalFreight: baseFreight,
        };
        await addDelivery(newDelivery);
      }
      if (shipment.id && deliveryDetails.selectedDocumentIds.length > 0) {
        try {
          const { error } = await supabase
            .from('shipment_documents')
            .update({ is_delivered: true })
            .in('id', deliveryDetails.selectedDocumentIds);
          if (error) console.error("Error updating shipment documents:", error);
        } catch (err) {
          console.error("Error updating shipment documents:", err);
        }
      }
      toast.success("Entregas criadas com sucesso");
      window.dispatchEvent(new CustomEvent('shipments-updated'));
    } catch (error) {
      console.error("Error creating deliveries from shipment:", error);
      toast.error("Erro ao criar entregas a partir do embarque");
    }
  };

  const calculateFreight = (
    clientId: string,
    weight: number,
    deliveryType: DeliveryType,
    cargoType: CargoType,
    cargoValue?: number,
    distance?: number,
    cityId?: string
  ): number => {
    // Usar o hook do useClientPriceTable para obter a tabela de preço do cliente
    const priceTable = getClientPriceTable(clientId);
    
    if (!priceTable) {
      console.log(`Cliente não possui tabela de preço associada`);
      return 0;
    }
    
    // Encontrar a cidade completa a partir do ID
    let cityObj = undefined;
    if (cityId) {
      cityObj = cities.find(c => c.id === cityId);
    }
    
    // Usar a função de cálculo de frete da utility
    return utilsCalculateFreight(
      priceTable,
      weight,
      deliveryType,
      cargoType,
      cargoValue,
      distance,
      cityObj
    );
  };

  const isDoorToDoorDelivery = (deliveryType: DeliveryType): boolean => {
    return doorToDoorDeliveryTypes.includes(deliveryType);
  };

  const checkMinuteNumberExists = (minuteNumber: string, clientId: string): boolean => {
    return deliveries.some(delivery => 
      delivery.minuteNumber === minuteNumber && 
      delivery.clientId === clientId
    );
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const refreshDeliveries = async () => {
    await fetchDeliveries();
  };

  return (
    <DeliveriesContext.Provider
      value={{
        deliveries,
        loading,
        addDelivery,
        updateDelivery,
        deleteDelivery,
        getDeliveryById,
        createDeliveriesFromShipment,
        refreshDeliveries,
        calculateFreight,
        isDoorToDoorDelivery,
        checkMinuteNumberExists
      }}
    >
      {children}
    </DeliveriesContext.Provider>
  );
};
