
// DeliveryType and related types
export type DeliveryType = 
  | 'standard'
  | 'emergency'
  | 'exclusive'
  | 'saturday'
  | 'sundayHoliday'
  | 'difficultAccess'
  | 'metropolitanRegion'
  | 'doorToDoorInterior'
  | 'reshipment'
  | 'normalBiological'
  | 'infectiousBiological'
  | 'tracked'
  | 'door_to_door'
  | 'scheduled';

export type CargoType = 'standard' | 'perishable';

// Array of delivery types that are door-to-door deliveries
export const doorToDoorDeliveryTypes: DeliveryType[] = [
  'doorToDoorInterior',
  'door_to_door'
];

export interface Delivery {
  id: string;
  minuteNumber: string;
  clientId: string;
  deliveryDate: string;
  deliveryTime: string;
  receiver: string;
  receiverId?: string;
  weight: number;
  packages: number;
  deliveryType: DeliveryType;
  cargoType: CargoType;
  cargoValue?: number;
  totalFreight: number;
  notes?: string;
  occurrence?: string;
  createdAt: string;
  updatedAt: string;
  cityId?: string;
  pickupName?: string;
  pickupDate?: string;
  pickupTime?: string;
}
