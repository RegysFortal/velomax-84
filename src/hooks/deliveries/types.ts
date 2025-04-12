
import { Delivery, DeliveryType, CargoType } from '@/types';

export interface DeliveryCreateInput extends Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> {
  invoiceNumbers?: string[];
}

export interface DeliveryResponse {
  id: string;
  minute_number: string;
  client_id: string;
  delivery_date: string;
  delivery_time: string;
  receiver: string;
  weight: number;
  packages: number;
  delivery_type: string;
  cargo_type: string;
  cargo_value: number | null;
  total_freight: number;
  notes: string;
  occurrence: string;
  city_id: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}
