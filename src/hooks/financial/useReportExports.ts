
import { Client, Delivery, FinancialReport } from '@/types';
import { createPDFReport, createExcelReport } from '@/utils/exportUtils';
import { getCompanyInfo } from '@/utils/printUtils';

type DeliveriesFilterFn = (report: FinancialReport) => Delivery[];
type FormatCurrencyFn = (value: number) => string;

export function useReportExports(
  clients: Client[],
  deliveriesForReport: DeliveriesFilterFn,
  formatCurrency: FormatCurrencyFn
) {
  // Get company information
  const companyData = getCompanyInfo();
  
  const handleExportPDF = (report: FinancialReport) => {
    const client = clients.find(c => c.id === report.clientId);
    
    // Get filtered deliveries for this report
    const filteredDeliveries = deliveriesForReport(report);
    
    createPDFReport({
      report,
      client,
      deliveries: filteredDeliveries,
      companyData,
      formatCurrency
    });
  };
  
  const handleExportExcel = (report: FinancialReport) => {
    const client = clients.find(c => c.id === report.clientId);
    const filteredDeliveries = deliveriesForReport(report);
    
    createExcelReport({
      report,
      client,
      deliveries: filteredDeliveries,
      companyData,
      formatCurrency
    });
  };

  return {
    handleExportPDF,
    handleExportExcel
  };
}
