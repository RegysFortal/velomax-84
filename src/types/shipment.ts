
export type ShipmentStatus = 
  | "in_transit"  // Em trânsito 
  | "retained"    // Retida
  | "delivered"   // Retirada
  | "delivered_final" // Entregue
  | "partially_delivered"; // Entregue Parcial

export type TransportMode = "air" | "road";

// Define status individual de documentos
export type DocumentStatus = "in_transit" | "picked_up" | "retained" | "delivered";

export interface FiscalAction {
  id: string;
  actionNumber?: string;
  reason: string;
  amountToPay: number;
  paymentDate?: string;
  releaseDate?: string;
  notes?: string;
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

// Document-specific delivery information
export interface DocumentDeliveryInfo {
  deliveryDate?: string;
  deliveryTime?: string;
  receiverName?: string;
  receiverId?: string;
  notes?: string;
}

export interface Document {
  id: string;
  name: string;
  type: "cte" | "invoice" | "delivery_location" | "other";
  url?: string;
  notes?: string;
  minuteNumber?: string;
  invoiceNumbers?: string[];
  weight?: number;
  packages?: number;
  status: DocumentStatus; // Status individual do documento
  isPriority?: boolean; // Flag de prioridade
  retentionInfo?: DocumentRetentionInfo;
  deliveryInfo?: DocumentDeliveryInfo;
  createdAt: string;
  updatedAt: string;
  // Campos de compatibilidade (manter por enquanto)
  isDelivered?: boolean;
  isRetained?: boolean;
  isPickedUp?: boolean;
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
  shipmentDate?: string;
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
