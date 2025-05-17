
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFinancial } from '@/contexts/financial';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useClients } from '@/contexts';
import { useToast } from '@/hooks/use-toast';
import { FinancialReport } from '@/types';
import { Delivery } from '@/types/delivery';
import { createPDFReport, createExcelReport, getCompanyInfo } from '@/utils/printUtils';
import { toLocalDate, toISODateString } from '@/utils/dateUtils';

export function useReportManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { financialReports, createReport, loading: reportLoading } = useFinancial();
  const { deliveries } = useDeliveries();
  const { clients, loading: clientsLoading } = useClients();
  const [selectedClient, setSelectedClient] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reportId, setReportId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableClients, setAvailableClients] = useState(clients);
  const companyData = getCompanyInfo();
  
  // Function to find clients with unreported deliveries
  const getClientsWithUnreportedDeliveries = () => {
    // Find all reportable deliveries that aren't in closed reports
    const closedReports = financialReports.filter(report => report.status === 'closed');
    
    // Create a Set to track which deliveries are already in closed reports
    const deliveriesInClosedReports = new Set();
    
    // Fill the Set with deliveries in closed reports
    closedReports.forEach(report => {
      const reportStartDate = new Date(report.startDate);
      const reportEndDate = new Date(report.endDate);
      
      // Configure hours for correct comparisons
      reportStartDate.setHours(0, 0, 0, 0);
      reportEndDate.setHours(23, 59, 59, 999);
      
      deliveries
        .filter(delivery => 
          delivery.clientId === report.clientId &&
          new Date(delivery.deliveryDate) >= reportStartDate &&
          new Date(delivery.deliveryDate) <= reportEndDate
        )
        .forEach(delivery => deliveriesInClosedReports.add(delivery.id));
    });
    
    // Filter deliveries that aren't in closed reports
    const unreportedDeliveries = deliveries.filter(
      delivery => !deliveriesInClosedReports.has(delivery.id)
    );
    
    // Return client IDs with unreported deliveries
    const clientIds = [...new Set(unreportedDeliveries.map(d => d.clientId))];
    return clientIds;
  };
  
  // Filter clients with unreported deliveries when the component loads
  // or when deliveries/financialReports change
  useEffect(() => {
    if (clients.length > 0 && deliveries.length > 0) {
      const clientsWithUnreportedDeliveries = getClientsWithUnreportedDeliveries();
      const filteredClients = clients.filter(client => 
        clientsWithUnreportedDeliveries.includes(client.id)
      );
      setAvailableClients(filteredClients);
    }
  }, [clients, deliveries, financialReports]);
  
  // Filter clients with deliveries in the selected period
  useEffect(() => {
    if (startDate && endDate) {
      // Use toLocalDate helper to ensure proper date comparison
      const startDateObj = toLocalDate(startDate);
      const endDateObj = toLocalDate(endDate);
      
      console.log('Filtrando clientes por período:', startDateObj, endDateObj);
      
      // Set hours to ensure proper date comparison
      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(23, 59, 59, 999);
      
      // Get unique client IDs with deliveries in the selected period
      const clientsWithDeliveries = deliveries
        .filter(delivery => {
          const deliveryDate = new Date(delivery.deliveryDate);
          return deliveryDate >= startDateObj && deliveryDate <= endDateObj;
        })
        .map(delivery => delivery.clientId);
      
      // Filter clients list to only include those with deliveries
      const uniqueClientIds = [...new Set(clientsWithDeliveries)];
      setAvailableClients(clients.filter(client => uniqueClientIds.includes(client.id)));
    } else {
      const clientsWithUnreportedDeliveries = getClientsWithUnreportedDeliveries();
      setAvailableClients(clients.filter(client => 
        clientsWithUnreportedDeliveries.includes(client.id)
      ));
    }
  }, [startDate, endDate, deliveries, clients]);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reportIdParam = params.get('reportId');
    setReportId(reportIdParam);
  }, [location.search]);

  const handleGenerateReport = async () => {
    if (!selectedClient || !startDate || !endDate) {
      toast({
        title: "Campos incompletos",
        description: 'Por favor, selecione um cliente e um período para gerar o relatório.',
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsGenerating(true);

      // Filter deliveries for the selected client and date range
      const startLocalDate = toLocalDate(startDate);
      const endLocalDate = toLocalDate(endDate);
      
      console.log('Gerando relatório - data inicial:', startLocalDate);
      console.log('Gerando relatório - data final:', endLocalDate);
      
      // Set hours for proper comparison
      startLocalDate.setHours(0, 0, 0, 0);
      endLocalDate.setHours(23, 59, 59, 999);
      
      const filteredDeliveries = deliveries.filter(delivery => {
        if (delivery.clientId !== selectedClient) return false;
        const deliveryDate = new Date(delivery.deliveryDate);
        return deliveryDate >= startLocalDate && deliveryDate <= endLocalDate;
      });

      // Calculate total freight
      const totalFreight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.totalFreight, 0);

      // Create the report with explicitly typed status
      const newReport: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'> = {
        clientId: selectedClient,
        startDate: toISODateString(startDate),
        endDate: toISODateString(endDate),
        totalDeliveries: filteredDeliveries.length,
        totalFreight: totalFreight,
        status: 'open', // Explicitly using the union type value
      };
      
      console.log('Dados do novo relatório:', newReport);
      
      const createdReport = await createReport(newReport);
      
      if (createdReport) {
        // Navigate to the new report
        navigate(`/reports?reportId=${createdReport.id}`);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const currentReport = financialReports.find(report => report.id === reportId);
  
  // Only show deliveries for open reports or if viewing a specific report
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
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const handleExportPDF = () => {
    if (!currentReport) return;
    
    const client = clients.find(c => c.id === currentReport.clientId);
    
    createPDFReport({
      report: currentReport,
      client,
      deliveries: filteredDeliveries,
      companyData,
      formatCurrency
    });
  };
  
  const handleExportExcel = () => {
    if (!currentReport) return;
    
    const client = clients.find(c => c.id === currentReport.clientId);
    
    createExcelReport({
      report: currentReport,
      client,
      deliveries: filteredDeliveries,
      companyData,
      formatCurrency
    });
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
