
import { FinancialReport } from '@/types';

export interface ReportPaymentDetails {
  reportId: string;
  paymentMethod: string | null; 
  dueDate: string | null;
}

export interface CloseReportParams {
  reportId: string;
  paymentMethod: string;
  dueDate: string;
}
