
/**
 * Data required to create a receivable account
 */
export interface ReceivableAccountData {
  clientId: string;
  clientName: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'received' | 'overdue' | 'partially_received';
  categoryId: string;
  categoryName?: string;
  reportId: string;
  paymentMethod?: string;
  notes?: string;
}

/**
 * Data for updating a receivable account
 */
export interface ReceivableAccountUpdate {
  paymentMethod?: string;
  dueDate?: string;
}

/**
 * Fixed category IDs
 */
export const FIXED_CATEGORIES = {
  FREIGHT: '4a7c9edd-9a55-4f3c-8562-19c95c5d2444',  // UUID for 'Fretes' category
  SERVICES: '6dd8917a-3a9a-4f5c-b647-9c853d3a2cd0'  // UUID for 'Services' category
};
