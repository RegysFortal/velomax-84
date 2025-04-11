
import { ShipmentStatus } from "@/types/shipment";

export interface ShipmentFormData {
  companyId: string;
  companyName: string;
  transportMode: "air" | "road";
  carrierName: string;
  trackingNumber: string;
  packages: number;
  weight: number;
  arrivalFlight?: string;
  arrivalDate?: string;
  observations?: string;
  status: ShipmentStatus;
  isRetained: boolean;
  deliveryDate?: string;
  deliveryTime?: string;
}

export interface FiscalActionFormData {
  reason: string;
  amountToPay: number;
  paymentDate?: string;
}
