
export interface FinancialReport {
  id: string;
  clientId: string;
  startDate: string;
  endDate: string;
  totalDeliveries: number;
  totalFreight: number;
  status: 'open' | 'closed' | 'archived';
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  paymentMethod?: string;  // Método de pagamento: pix, boleto, cartao, especie, transferencia
  dueDate?: string;        // Data de vencimento
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'inbound' | 'outbound' | 'both';  // Incoming, outgoing or both
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
}

export interface IncomeCategory {
  id: string;
  name: string;
  description?: string;
}

export interface PayableAccount {
  id: string;
  supplierName: string;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod: string;  // boleto, pix, card, transfer, cash
  status: 'pending' | 'paid' | 'overdue';
  categoryId: string;
  categoryName?: string;
  recurring?: boolean;
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  installments?: number;
  currentInstallment?: number;
  isFixedExpense: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
  receivedMethod?: string;  // pix, cash, bank_slip, transfer
  status: 'pending' | 'received' | 'overdue' | 'partially_received';
  categoryId: string;
  categoryName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
