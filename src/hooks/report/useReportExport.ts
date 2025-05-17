
import { createPDFReport, createExcelReport, getCompanyInfo } from '@/utils/printUtils';

export function useReportExport() {
  const companyData = getCompanyInfo();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const exportPDF = (currentReport: any, client: any, deliveries: any[]) => {
    if (!currentReport) return;
    
    createPDFReport({
      report: currentReport,
      client,
      deliveries,
      companyData,
      formatCurrency
    });
  };
  
  const exportExcel = (currentReport: any, client: any, deliveries: any[]) => {
    if (!currentReport) return;
    
    createExcelReport({
      report: currentReport,
      client,
      deliveries,
      companyData,
      formatCurrency
    });
  };

  return {
    formatCurrency,
    exportPDF,
    exportExcel
  };
}
