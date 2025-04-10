
import { Shipment, Document, FiscalAction } from "@/types/shipment";

export interface ShipmentCreateData extends Omit<Shipment, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'fiscalAction'> {
  fiscalActionData?: Omit<FiscalAction, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface DocumentCreateData extends Omit<Document, 'id' | 'createdAt' | 'updatedAt'> {}

export interface FiscalActionCreateData extends Omit<FiscalAction, 'id' | 'createdAt' | 'updatedAt'> {}
