
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

export interface ReceivableAccount {
  id: string;
  clientId: string;
  clientName: string;
  description: string;
  amount: number;
  dueDate: string;
  receivedDate?: string;
  receivedAmount?: number;
  remainingAmount?: number;
  status: 'pending' | 'received' | 'overdue' | 'partially_received';
  categoryId: string;
  categoryName: string;
  notes?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  reportId?: string;
}
