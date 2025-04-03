
export type ShipmentStatus = 
  | "in_transit"  // Em trânsito 
  | "retained"    // Retida
  | "delivered"   // Retirada
  | "delivered_final"; // Entregue

export type TransportMode = "air" | "road";

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
  type: "cte" | "invoice" | "delivery_location" | "other";
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
  transportMode: TransportMode;
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
  deliveryDate?: string;
  deliveryTime?: string;
  receiverName?: string;
  createdAt: string;
  updatedAt: string;
}

// Add a Delivery type to ensure packages is a recognized property
export interface Delivery {
  id: string;
  clientId: string;
  minuteNumber: string;
  deliveryDate: string;
  deliveryTime?: string;
  receiver?: string;
  cityId?: string;
  weight: number;
  packages: number;
  cargoType: string;
  deliveryType: string;
  cargoValue: number;
  totalFreight: number;
  customPricing: boolean;
  discount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
