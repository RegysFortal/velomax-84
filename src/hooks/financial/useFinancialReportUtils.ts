
import { useState } from 'react';
import { FinancialReport } from '@/types';
import { useClients } from '@/contexts';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createPDFReport, createExcelReport } from '@/utils/printUtils';
import { getCompanyInfo } from '@/utils/printUtils';

export function useFinancialReportUtils() {
  // Get clients data safely with fallbacks
  const { clients = [] } = useClients();
  
  // Get deliveries data
  const { deliveries = [] } = useDeliveries();
  
  // Get company information
  const companyData = getCompanyInfo();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  // Helper function to get deliveries for a specific report
  const deliveriesForReport = (report: FinancialReport) => {
    return deliveries.filter(delivery => {
      if (delivery.clientId !== report.clientId) return false;
      
      const deliveryDate = new Date(delivery.deliveryDate);
      const startDate = new Date(report.startDate);
      const endDate = new Date(report.endDate);
      
      // Set hours to ensure correct comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      return deliveryDate >= startDate && deliveryDate <= endDate;
    });
  };
  
  // Formatar método de pagamento para exibição
  const getPaymentMethodLabel = (method?: string) => {
    if (!method) return "N/A";
    
    const methods = {
      boleto: "Boleto",
      pix: "PIX",
      cartao: "Cartão",
      especie: "Espécie",
      transferencia: "Transferência"
    };
    
    return methods[method as keyof typeof methods] || method;
  };
  
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
    formatCurrency,
    deliveriesForReport,
    getPaymentMethodLabel,
    handleExportPDF,
    handleExportExcel
  };
}
