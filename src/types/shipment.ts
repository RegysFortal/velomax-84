
export type ShipmentStatus = 
  | "in_transit"  // Em trânsito 
  | "retained"    // Retida
  | "delivered";  // Retirada

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
  fiscalAction?: FiscalAction;  // This property is now explicitly optional
  documents: Document[];
  deliveryDate?: string;
  deliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}
