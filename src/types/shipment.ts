
export type ShipmentStatus = 
  | "in_transit"  // Em trânsito 
  | "at_carrier"  // Na Transportadora (new status)
  | "retained"    // Retida
  | "delivered"   // Retirada
  | "delivered_final" // Entregue
  | "partially_delivered"; // Entregue Parcial

export type TransportMode = "air" | "road";

// Define a consistent DocumentStatus type
export type DocumentStatus = "retained" | "delivered" | "picked_up" | "pending";

export interface FiscalAction {
  id: string;
  actionNumber?: string; // Adding the fiscal action number field
  reason: string;
  amountToPay: number;
  paymentDate?: string;
  releaseDate?: string;
  notes?: string; // Added for additional details
  createdAt: string;
  updatedAt: string;
}

// Document-specific retention information
export interface DocumentRetentionInfo {
  actionNumber?: string;
  reason?: string;
  amount?: string;
  paymentDate?: string;
  releaseDate?: string;
  notes?: string;
}

export interface Document {
  id: string;
  name: string;
  type: "cte" | "invoice" | "delivery_location" | "other";
  url?: string;
  notes?: string;
  minuteNumber?: string;
  invoiceNumbers?: string[]; // Add array of invoice numbers
  weight?: number;
  packages?: number;
  isDelivered?: boolean;
  isRetained?: boolean;
  isPickedUp?: boolean; // New flag for "Retirado" status
  isPriority?: boolean; // New flag for prioritized documents
  retentionInfo?: DocumentRetentionInfo; // Document-specific retention info
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
  receiverId?: string;
  createdAt: string;
  updatedAt: string;
}
