
import React, { createContext } from 'react';
import type { Delivery, DeliveryFormData, DeliveryType, CargoType } from '@/types';
import type { ReactNode } from 'react';

export interface DeliveriesContextType {
  deliveries: Delivery[];
  loading: boolean;
  addDelivery: (delivery: DeliveryFormData) => Promise<Delivery | undefined>;
  updateDelivery: (id: string, data: Partial<Delivery>) => Promise<Delivery | undefined>;
  deleteDelivery: (id: string) => Promise<boolean>;
  getDeliveryById: (id: string) => Delivery | undefined;
  createDeliveriesFromShipment: (shipment: any, deliveryDetails: any) => Promise<void>;
  refreshDeliveries: () => Promise<void>;
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

export const DeliveriesContext = createContext<DeliveriesContextType | undefined>(undefined);

export const DeliveriesProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  // Implementation moved to DeliveriesProvider.tsx
  throw new Error('DeliveriesProvider implementation moved to DeliveriesProvider.tsx, please import DeliveriesProvider from there.');
};
