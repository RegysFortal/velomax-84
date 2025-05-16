
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useFinancial } from '@/contexts/financial';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useClients } from '@/contexts';
import { ReportTable } from '@/components/report/ReportTable';
import { ReportSummary } from '@/components/report/ReportSummary';
import { FinancialReport } from '@/types';
import { Delivery as TypedDelivery } from '@/types/delivery';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { FileDown, FileUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/ui/logo';
import { getCompanyInfo, formatClientNameForFileName, createPDFReport, createExcelReport } from '@/utils/printUtils';

const Reports = () => {
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
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
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
      const filteredDeliveries = deliveries.filter(delivery => {
        if (delivery.clientId !== selectedClient) return false;
        const deliveryDate = new Date(delivery.deliveryDate);
        return deliveryDate >= startDate && deliveryDate <= endDate;
      });

      // Calculate total freight
      const totalFreight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.totalFreight, 0);

      // Create the report with explicitly typed status
      const newReport: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'> = {
        clientId: selectedClient,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalDeliveries: filteredDeliveries.length,
        totalFreight: totalFreight,
        status: 'open', // Explicitly using the union type value
      };
      
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
  }) as unknown as TypedDelivery[];
  
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

  return (
    <AppLayout>
      <ScrollArea className="h-[calc(100vh-148px)] w-full">
        <div className="flex flex-col gap-6 px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Gere relatórios financeiros detalhados.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Gerar Novo Relatório</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Cliente</Label>
                  {clientsLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <ClientSearchSelect
                      value={selectedClient}
                      onValueChange={setSelectedClient}
                      placeholder="Selecione um cliente"
                      disabled={isGenerating}
                      clients={availableClients}
                    />
                  )}
                </div>
                <div>
                  <Label>Período</Label>
                  <div className="flex gap-2">
                    <DatePicker 
                      date={startDate} 
                      onSelect={setStartDate} 
                      placeholder={isGenerating ? "Carregando..." : "Data inicial"} 
                    />
                    <DatePicker 
                      date={endDate} 
                      onSelect={setEndDate} 
                      placeholder={isGenerating ? "Carregando..." : "Data final"} 
                    />
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleGenerateReport} 
                disabled={isGenerating || reportLoading || !selectedClient || !startDate || !endDate}
              >
                {isGenerating ? "Gerando..." : "Gerar Relatório"}
              </Button>
            </CardContent>
          </Card>
          
          {/* Hidden logo for PDF generation */}
          <div className="hidden">
            <Logo className="company-logo" />
          </div>
          
          {reportLoading ? (
            <Card>
              <CardContent className="py-6">
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          ) : currentReport ? (
            <>
              <div className="flex justify-between items-center">
                <ReportSummary report={currentReport} />
                {currentReport.status === 'closed' && (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleExportPDF}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Exportar PDF
                    </Button>
                    <Button variant="outline" onClick={handleExportExcel}>
                      <FileUp className="mr-2 h-4 w-4" />
                      Exportar Excel
                    </Button>
                  </div>
                )}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Relatório</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReportTable deliveries={filteredDeliveries} />
                </CardContent>
              </Card>
            </>
          ) : reportId && (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">Relatório não encontrado</p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </AppLayout>
  );
};

export default Reports;
