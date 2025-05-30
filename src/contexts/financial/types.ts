
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
  paymentMethod?: string;
  dueDate?: string;
}

export interface FinancialContextType {
  financialReports: FinancialReport[];
  addFinancialReport: (report: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => Promise<void>;
  deleteFinancialReport: (id: string) => Promise<void>;
  getFinancialReport: (id: string) => FinancialReport | undefined;
  getReportsByStatus: (status: FinancialReport['status']) => FinancialReport[];
  closeReport: (id: string, paymentMethod?: string, dueDate?: string) => Promise<void>;
  reopenReport: (id: string, newStatus?: 'open' | 'closed') => Promise<void>;
  archiveReport: (id: string) => Promise<void>;
  createReport: (report: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FinancialReport | null>;
  updatePaymentDetails: (id: string, paymentMethod: string | null, dueDate: string | null) => Promise<void>;
  loading: boolean;
}
