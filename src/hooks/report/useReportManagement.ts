
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useFinancial } from '@/contexts/financial';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useReportClients } from './useReportClients';
import { useReportGeneration } from './useReportGeneration';
import { useReportExport } from './useReportExport';
import { Delivery } from '@/types/delivery';
import { FinancialReport } from '@/types';

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
  const [currentGeneratedReport, setCurrentGeneratedReport] = useState<FinancialReport | null>(null);
  
  // Extract report ID from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reportIdParam = params.get('reportId');
    setReportId(reportIdParam);
  }, [location.search]);
  
  // Memoize the clients with unreported deliveries calculation
  const clientsWithUnreportedDeliveries = useMemo(() => {
    if (clients.length === 0 || deliveries.length === 0) return [];
    
    const unreportedClientIds = getClientsWithUnreportedDeliveries(financialReports);
    return clients.filter(client => unreportedClientIds.includes(client.id));
  }, [clients, deliveries, financialReports, getClientsWithUnreportedDeliveries]);
  
  // Update available clients when data changes
  useEffect(() => {
    console.log('useReportManagement - Updating available clients');
    
    if (startDate && endDate && clients.length > 0) {
      console.log('Filtering clients by date range');
      const filteredClients = filterClientsByDateRange(startDate, endDate);
      console.log('Setting filtered clients:', filteredClients.length);
      setAvailableClients(filteredClients);
    } else if (clients.length > 0 && deliveries.length > 0) {
      console.log('Setting default available clients:', clientsWithUnreportedDeliveries.length);
      setAvailableClients(clientsWithUnreportedDeliveries);
    }
  }, [
    startDate, 
    endDate, 
    clients.length, 
    deliveries.length, 
    financialReports.length,
    filterClientsByDateRange, 
    setAvailableClients, 
    clientsWithUnreportedDeliveries
  ]);
  
  // Handle report generation
  const handleGenerateReport = useCallback(async () => {
    console.log('handleGenerateReport called with:', {
      selectedClient,
      startDate,
      endDate,
      deliveriesCount: deliveries?.length || 0,
      isGenerating
    });

    if (!selectedClient) {
      console.error('No client selected');
      return;
    }

    if (!startDate || !endDate) {
      console.error('Dates not provided', { startDate, endDate });
      return;
    }

    if (!deliveries || deliveries.length === 0) {
      console.error('No deliveries available');
      return;
    }

    try {
      console.log('Calling generateReport...');
      const result = await generateReport({
        selectedClient,
        startDate,
        endDate,
        deliveries
      });
      
      console.log('generateReport result:', result);
      
      if (result) {
        console.log('Report generated successfully, staying on reports page');
        setCurrentGeneratedReport(result);
        setReportId(result.id);
        // Update URL without redirecting
        const newUrl = `${location.pathname}?reportId=${result.id}`;
        window.history.pushState({}, '', newUrl);
      } else {
        console.log('generateReport returned null - possible error');
      }
    } catch (error) {
      console.error('Error in handleGenerateReport:', error);
    }
  }, [selectedClient, startDate, endDate, deliveries, generateReport, location.pathname]);
  
  // Get current report and deliveries
  const currentReport = currentGeneratedReport || financialReports.find(report => report.id === reportId);
  
  // Filter deliveries for the current report
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(delivery => {
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
  }, [deliveries, currentReport, reportId]);
  
  // Export handlers
  const handleExportPDF = useCallback(() => {
    if (!currentReport) return;
    const client = clients.find(c => c.id === currentReport.clientId);
    exportPDF(currentReport, client, filteredDeliveries);
  }, [currentReport, clients, filteredDeliveries, exportPDF]);
  
  const handleExportExcel = useCallback(() => {
    if (!currentReport) return;
    const client = clients.find(c => c.id === currentReport.clientId);
    exportExcel(currentReport, client, filteredDeliveries);
  }, [currentReport, clients, filteredDeliveries, exportExcel]);

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
