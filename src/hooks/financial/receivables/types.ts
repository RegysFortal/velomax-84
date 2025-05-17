
export interface ReceivableAccountData {
  clientId: string;
  clientName: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'received' | 'overdue' | 'partially_received';
  categoryId: string;
  categoryName: string;
  reportId: string;
  paymentMethod: string;
  notes?: string;
}

export interface ReceivableAccountUpdate {
  paymentMethod?: string;
  dueDate?: string;
}
