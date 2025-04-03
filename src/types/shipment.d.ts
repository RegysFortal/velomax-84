
export type ShipmentStatus = 'in_transit' | 'retained' | 'delivered' | 'delivered_final';

export interface FiscalAction {
  id: string;
  reason: string;
  amountToPay: number;
  paymentDate?: string;
  releaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type?: 'cte' | 'invoice' | 'delivery_location' | 'other';
  url?: string;
  notes?: string;
  minuteNumber?: string;
  weight?: number;
  packages?: number;
  isDelivered?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  companyId: string;
  companyName: string;
  transportMode: 'air' | 'road';
  carrierName: string;
  trackingNumber: string;
  packages: number;
  weight: number;
  arrivalFlight?: string;
  arrivalDate?: string;
  observations?: string;
  status: ShipmentStatus;
  isRetained: boolean;
  fiscalAction?: FiscalAction;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
  
  // Delivery information
  deliveryDate?: string;
  deliveryTime?: string;
  receiverName?: string;
}
