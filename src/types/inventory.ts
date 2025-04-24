
export interface Product {
  id: string;
  name: string;
  code: string; // Internal code or barcode
  unit: string; // kg, L, m², unit, etc.
  category: string; // Raw material, finished product, input, etc.
  supplier: string;
  location: string; // Location in the warehouse
  minStock?: number; // For minimum stock alerts
  currentStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockEntry {
  id: string;
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  invoiceNumber: string;
  supplier: string;
  unitPrice: number;
  totalPrice: number;
  transportDocument: string;
  receivedBy: string;
  observations?: string;
  createdAt: string;
}

export interface StockExit {
  id: string;
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  purpose: string; // Sale, maintenance, production, return, etc.
  withdrawnBy: string;
  documentNumber?: string;
  observations?: string;
  createdAt: string;
}

export interface StockAdjustment {
  id: string;
  date: string;
  productId: string;
  productName: string;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  adjustedBy: string;
  observations?: string;
  createdAt: string;
}

export type StockMovementType = 'entry' | 'exit' | 'adjustment';

export interface StockMovement {
  id: string;
  type: StockMovementType;
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  reference: string; // ID of the entry, exit, or adjustment
  createdAt: string;
}
