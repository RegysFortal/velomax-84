
import { useState, useEffect, useCallback } from 'react';
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
  const clientsWithUnreportedDeliveries = useCallback(() => {
    if (clients.length === 0 || deliveries.length === 0) return [];
    
    const unreportedClientIds = getClientsWithUnreportedDeliveries(financialReports);
    return clients.filter(client => unreportedClientIds.includes(client.id));
  }, [clients, deliveries, financialReports, getClientsWithUnreportedDeliveries]);
  
  // Update available clients when data changes
  useEffect(() => {
    if (clients.length > 0 && deliveries.length > 0) {
      const availableClientsList = clientsWithUnreportedDeliveries();
      console.log('Atualizando clientes disponíveis:', availableClientsList.length);
      setAvailableClients(availableClientsList);
    }
  }, [clients.length, deliveries.length, financialReports.length, clientsWithUnreportedDeliveries, setAvailableClients]);
  
  // Filter clients by date range when dates change
  useEffect(() => {
    if (startDate && endDate && clients.length > 0) {
      console.log('Filtrando clientes por período');
      const filteredClients = filterClientsByDateRange(startDate, endDate);
      setAvailableClients(filteredClients);
    }
  }, [startDate, endDate, clients.length, filterClientsByDateRange, setAvailableClients]);
  
  // Handle report generation
  const handleGenerateReport = async () => {
    console.log('handleGenerateReport executado com parâmetros:', {
      selectedClient,
      startDate,
      endDate,
      deliveriesCount: deliveries?.length || 0,
      isGenerating
    });

    if (!selectedClient) {
      console.error('Cliente não selecionado');
      return;
    }

    if (!startDate || !endDate) {
      console.error('Datas não informadas', { startDate, endDate });
      return;
    }

    if (!deliveries || deliveries.length === 0) {
      console.error('Nenhuma entrega disponível');
      return;
    }

    try {
      console.log('Chamando generateReport...');
      const result = await generateReport({
        selectedClient,
        startDate,
        endDate,
        deliveries
      });
      
      console.log('Resultado do generateReport:', result);
      
      if (result) {
        console.log('Relatório gerado com sucesso');
        // Set the generated report and update URL
        setCurrentGeneratedReport(result);
        setReportId(result.id);
        // Update URL without redirecting
        const newUrl = `${location.pathname}?reportId=${result.id}`;
        window.history.pushState({}, '', newUrl);
      } else {
        console.log('generateReport retornou null - possível erro');
      }
    } catch (error) {
      console.error('Erro em handleGenerateReport:', error);
    }
  };
  
  // Get current report and deliveries
  const currentReport = currentGeneratedReport || financialReports.find(report => report.id === reportId);
  
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
