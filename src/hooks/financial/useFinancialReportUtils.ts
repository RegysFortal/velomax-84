
import { useState } from 'react';
import { FinancialReport } from '@/types';
import { useClients } from '@/contexts';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createPDFReport, createExcelReport } from '@/utils/exportUtils';
import { getCompanyInfo } from '@/utils/printUtils';
import { useDeliveriesFiltering } from './useDeliveriesFiltering';
import { useFinancialFormatting } from './useFinancialFormatting';
import { useReportExports } from './useReportExports';

export function useFinancialReportUtils() {
  // Get clients data safely with fallbacks
  const { clients = [] } = useClients();
  
  // Get deliveries data
  const { deliveries = [] } = useDeliveries();
  
  // Use our specific hooks for related functionality
  const { deliveriesForReport } = useDeliveriesFiltering(deliveries);
  const { formatCurrency, getPaymentMethodLabel } = useFinancialFormatting();
  const { handleExportPDF, handleExportExcel } = useReportExports(
    clients, 
    deliveriesForReport, 
    formatCurrency
  );

  return {
    formatCurrency,
    deliveriesForReport,
    getPaymentMethodLabel,
    handleExportPDF,
    handleExportExcel
  };
}
