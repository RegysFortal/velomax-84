
import React, { createContext, useContext } from 'react';
import { Delivery, DeliveryFormData } from '@/types';
import { Shipment } from '@/types/shipment';

export interface DeliveriesContextType {
  deliveries: Delivery[];
  loading: boolean;
  addDelivery: (delivery: DeliveryFormData) => Promise<Delivery | undefined>;
  updateDelivery: (id: string, delivery: Partial<Delivery>) => Promise<Delivery | undefined>;
  deleteDelivery: (id: string) => Promise<boolean>;
  getDeliveryById: (id: string) => Delivery | undefined;
  createDeliveriesFromShipment: (shipment: Shipment) => Promise<Delivery[]>;
  refreshDeliveries: () => Promise<void>;
  fetchDeliveries: () => Promise<Delivery[]>;
  calculateFreight: (deliveryType: string, cityId?: string, weight?: number, packages?: number, clientId?: string) => number;
  isDoorToDoorDelivery: (deliveryType: string) => boolean;
  checkMinuteNumberExists: (minuteNumber: string, clientId: string) => boolean;
  checkMinuteNumberExistsForClient: (minuteNumber: string, clientId: string, excludeId?: string) => boolean;
}

const DeliveriesContext = createContext<DeliveriesContextType | undefined>(undefined);

export const useDeliveries = () => {
  const context = useContext(DeliveriesContext);
  if (!context) {
    throw new Error('useDeliveries must be used within a DeliveriesProvider');
  }
  return context;
};

export { DeliveriesContext };
