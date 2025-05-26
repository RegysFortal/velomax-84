
import React, { useState, useEffect } from 'react';
import { DeliveryFormData } from '@/types/delivery';
import { Delivery } from '@/types';
import { DeliveriesContext } from './DeliveriesContext';
import { useClientPriceTable } from '@/contexts/budget/useClientPriceTable';
import { useDeliveriesCRUD } from './hooks/useDeliveriesCRUD';
import { useFreightCalculation } from './hooks/useFreightCalculation';
import { useShipmentToDelivery } from './hooks/useShipmentToDelivery';
import { useDeliveryTypes } from './hooks/useDeliveryTypes';
import { useCitiesData } from './hooks/useCitiesData';

export const DeliveriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  
  // Get cities data
  const { cities } = useCitiesData();
  
  // Get delivery CRUD operations
  const { 
    loading, 
    addDelivery, 
    updateDelivery, 
    deleteDelivery, 
    getDeliveryById,
    fetchDeliveries: fetchDeliveriesFromHook 
  } = useDeliveriesCRUD(deliveries, setDeliveries);
  
  // Safely get the required hooks
  let getClientPriceTable = (clientId: string) => undefined;
  
  try {
    const clientPriceTableHook = useClientPriceTable();
    getClientPriceTable = clientPriceTableHook.getClientPriceTable;
  } catch (error) {
    console.warn("useClientPriceTable not available, using fallback");
  }

  // Get freight calculation
  const { calculateFreight: calculateFreightFromHook } = useFreightCalculation(getClientPriceTable, cities);
  
  // Wrapper function to match the expected signature
  const calculateFreight = (deliveryType: string, cityId?: string, weight?: number, packages?: number, clientId?: string): number => {
    if (!clientId || !weight) return 0;
    
    return calculateFreightFromHook(
      clientId,
      weight,
      deliveryType as any,
      'standard' as any,
      undefined,
      undefined,
      cityId
    );
  };
  
  // Get shipment to delivery conversion
  const { createDeliveriesFromShipment: createDeliveriesFromShipmentHook } = useShipmentToDelivery(calculateFreightFromHook, addDelivery);
  
  // Wrapper function to match the expected signature
  const createDeliveriesFromShipment = async (shipment: any): Promise<Delivery[]> => {
    // For backward compatibility, we'll call the hook function with empty delivery details
    await createDeliveriesFromShipmentHook(shipment, {
      receiverName: '',
      deliveryDate: '',
      deliveryTime: '',
      selectedDocumentIds: shipment.documents?.map((doc: any) => doc.id) || []
    });
    return [];
  };
  
  // Get delivery type utilities
  const { isDoorToDoorDelivery, checkMinuteNumberExists } = useDeliveryTypes();

  // Load initial data
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const refreshDeliveries = async () => {
    await fetchDeliveries();
  };
  
  // Wrap fetchDeliveries to match the expected return type in context
  const fetchDeliveries = async (): Promise<Delivery[]> => {
    return await fetchDeliveriesFromHook();
  };

  // New function to check minute number exists for specific client
  const checkMinuteNumberExistsForClient = (minuteNumber: string, clientId: string, excludeId?: string): boolean => {
    return deliveries.some(delivery => 
      delivery.minuteNumber === minuteNumber && 
      delivery.clientId === clientId &&
      (!excludeId || delivery.id !== excludeId)
    );
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
        fetchDeliveries,
        calculateFreight,
        isDoorToDoorDelivery,
        checkMinuteNumberExists: (minuteNumber: string, clientId: string) => 
          checkMinuteNumberExists(deliveries, minuteNumber, clientId),
        checkMinuteNumberExistsForClient
      }}
    >
      {children}
    </DeliveriesContext.Provider>
  );
};
