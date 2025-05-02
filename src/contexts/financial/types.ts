
import { FinancialReport } from '@/types';

export type FinancialContextType = {
  financialReports: FinancialReport[];
  addFinancialReport: (report: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => Promise<void>;
  deleteFinancialReport: (id: string) => Promise<void>;
  getFinancialReport: (id: string) => FinancialReport | undefined;
  getReportsByStatus: (status: FinancialReport['status']) => FinancialReport[];
  closeReport: (id: string) => Promise<void>;
  reopenReport: (id: string) => Promise<void>;
  createReport: (report: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FinancialReport | null>;
  loading: boolean;
};
