
import { createContext, useContext, ReactNode } from 'react';
import { Delivery } from '@/types';
import { useDeliveriesStorage } from '@/hooks/useDeliveriesStorage';
import { useDeliveriesCRUD } from '@/hooks/useDeliveriesCRUD';
import { useFreightCalculation } from '@/hooks/useFreightCalculation';
import { isDoorToDoorDelivery, isExclusiveDelivery, checkMinuteNumberExists } from '@/utils/deliveryUtils';
import { usePriceTables } from '@/contexts/PriceTablesContext';

type DeliveriesContextType = {
  deliveries: Delivery[];
  addDelivery: (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  updateDelivery: (id: string, delivery: Partial<Delivery>) => Promise<void>;
  deleteDelivery: (id: string) => Promise<void>;
  getDelivery: (id: string) => Delivery | undefined;
  calculateFreight: (
    clientId: string,
    weight: number,
    deliveryType: Delivery['deliveryType'],
    cargoType: Delivery['cargoType'],
    cargoValue?: number,
    distance?: number,
    cityId?: string
  ) => number;
  isDoorToDoorDelivery: (deliveryType: Delivery['deliveryType']) => boolean;
  isExclusiveDelivery: (deliveryType: Delivery['deliveryType']) => boolean;
  loading: boolean;
  checkMinuteNumberExists: (minuteNumber: string, clientId: string) => boolean;
};

const DeliveriesContext = createContext<DeliveriesContextType | undefined>(undefined);

export const DeliveriesProvider = ({ children }: { children: ReactNode }) => {
  const { deliveries, setDeliveries, loading } = useDeliveriesStorage();
  const { addDelivery, updateDelivery, deleteDelivery, getDelivery } = useDeliveriesCRUD(deliveries, setDeliveries);
  const { priceTables } = usePriceTables();
  const { calculateFreight } = useFreightCalculation(priceTables);
  
  const checkMinuteNumberExistsForClient = (minuteNumber: string, clientId: string): boolean => {
    return checkMinuteNumberExists(deliveries, minuteNumber, clientId);
  };
  
  return (
    <DeliveriesContext.Provider value={{
      deliveries,
      addDelivery,
      updateDelivery,
      deleteDelivery,
      getDelivery,
      calculateFreight,
      isDoorToDoorDelivery,
      isExclusiveDelivery,
      loading,
      checkMinuteNumberExists: checkMinuteNumberExistsForClient,
    }}>
      {children}
    </DeliveriesContext.Provider>
  );
};

export const useDeliveries = () => {
  const context = useContext(DeliveriesContext);
  if (context === undefined) {
    throw new Error('useDeliveries must be used within a DeliveriesProvider');
  }
  return context;
};
