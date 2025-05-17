
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFinancial } from '@/contexts/financial';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useReportClients } from './useReportClients';
import { useReportGeneration } from './useReportGeneration';
import { useReportExport } from './useReportExport';
import { Delivery } from '@/types/delivery';

export function useReportManagement() {
  const location = useLocation();
  const { financialReports, loading: reportLoading } = useFinancial();
  const { deliveries } = useDeliveries();
  const { 
    clients, 
    clientsLoading, 
    availableClients, 
    setAvailableClients, 
    getClientsWithUnreportedDeliveries,
    filterClientsByDateRange
  } = useReportClients();
  const { isGenerating, generateReport } = useReportGeneration();
  const { exportPDF, exportExcel } = useReportExport();
  
  const [selectedClient, setSelectedClient] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reportId, setReportId] = useState<string | null>(null);
  
  // Extract report ID from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reportIdParam = params.get('reportId');
    setReportId(reportIdParam);
  }, [location.search]);
  
  // Filter clients with unreported deliveries
  useEffect(() => {
    if (clients.length > 0 && deliveries.length > 0) {
      const clientsWithUnreportedDeliveries = getClientsWithUnreportedDeliveries(financialReports);
      const filteredClients = clients.filter(client => 
        clientsWithUnreportedDeliveries.includes(client.id)
      );
      setAvailableClients(filteredClients);
    }
  }, [clients, deliveries, financialReports]);
  
  // Filter clients by date range
  useEffect(() => {
    if (startDate && endDate) {
      const filteredClients = filterClientsByDateRange(startDate, endDate);
      setAvailableClients(filteredClients);
    } else {
      const clientsWithUnreportedDeliveries = getClientsWithUnreportedDeliveries(financialReports);
      setAvailableClients(clients.filter(client => 
        clientsWithUnreportedDeliveries.includes(client.id)
      ));
    }
  }, [startDate, endDate]);
  
  // Handle report generation
  const handleGenerateReport = async () => {
    await generateReport({
      selectedClient,
      startDate,
      endDate,
      deliveries
    });
  };
  
  // Get current report and deliveries
  const currentReport = financialReports.find(report => report.id === reportId);
  
  // Filter deliveries for the current report
  const filteredDeliveries = deliveries.filter(delivery => {
    if (!currentReport) return false;
    
    // Check if the report is closed and not specifically being viewed
    const isClosedReport = currentReport.status === 'closed' && !reportId;
    if (isClosedReport) return false;
    
    if (delivery.clientId !== currentReport.clientId) return false;
    
    const deliveryDate = new Date(delivery.deliveryDate);
    const startDate = new Date(currentReport.startDate);
    const endDate = new Date(currentReport.endDate);
    
    return deliveryDate >= startDate && deliveryDate <= endDate;
  }) as Delivery[];
  
  // Export handlers
  const handleExportPDF = () => {
    if (!currentReport) return;
    const client = clients.find(c => c.id === currentReport.clientId);
    exportPDF(currentReport, client, filteredDeliveries);
  };
  
  const handleExportExcel = () => {
    if (!currentReport) return;
    const client = clients.find(c => c.id === currentReport.clientId);
    exportExcel(currentReport, client, filteredDeliveries);
  };

  return {
    selectedClient,
    setSelectedClient,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    reportId,
    isGenerating,
    reportLoading,
    availableClients,
    clientsLoading,
    currentReport,
    filteredDeliveries,
    handleGenerateReport,
    handleExportPDF,
    handleExportExcel,
  };
}
