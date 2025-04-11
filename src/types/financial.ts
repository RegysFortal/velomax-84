
export interface FinancialReport {
  id: string;
  clientId: string;
  startDate: string;
  endDate: string;
  totalDeliveries: number;
  totalFreight: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}
