
import { Delivery } from '@/types/delivery';

export interface DeliveryResponse {
  id: string;
  minute_number: string;
  client_id: string;
  delivery_date: string;
  delivery_time: string;
  receiver: string;
  receiver_document?: string;
  weight: number;
  packages: number;
  delivery_type: string;
  cargo_type: string;
  cargo_value?: number;
  total_freight: number;
  notes?: string;
  occurrence?: string;
  created_at: string;
  updated_at: string;
  city_id?: string;
  pickup_person?: string;
  pickup_date?: string;
  pickup_time?: string;
  user_id?: string;
}

export interface DeliveryCreateInput {
  minuteNumber: string;
  clientId: string;
  deliveryDate: string;
  deliveryTime?: string;
  receiver: string;
  receiverId?: string; 
  weight: number;
  packages: number;
  deliveryType: Delivery['deliveryType'];
  cargoType: Delivery['cargoType'];
  cargoValue?: number;
  totalFreight: number;
  notes?: string;
  occurrence?: string;
  cityId?: string;
  pickupName?: string;
  pickupDate?: string;
  pickupTime?: string;
}
