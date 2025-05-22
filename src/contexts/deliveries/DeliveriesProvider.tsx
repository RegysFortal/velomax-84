
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
  const { calculateFreight } = useFreightCalculation(getClientPriceTable, cities);
  
  // Get shipment to delivery conversion
  const { createDeliveriesFromShipment } = useShipmentToDelivery(calculateFreight, addDelivery);
  
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
          checkMinuteNumberExists(deliveries, minuteNumber, clientId)
      }}
    >
      {children}
    </DeliveriesContext.Provider>
  );
};
