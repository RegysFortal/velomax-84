
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useFinancial } from '@/contexts/FinancialContext';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useClients } from '@/contexts';
import { ReportTable } from '@/components/report/ReportTable';
import { ReportSummary } from '@/components/report/ReportSummary';
import { FinancialReport } from '@/types';
import { Delivery as TypedDelivery } from '@/types/delivery';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

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
  const [filteredClients, setFilteredClients] = useState(clients);
  
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
      setFilteredClients(clients.filter(client => uniqueClientIds.includes(client.id)));
    } else {
      setFilteredClients(clients);
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
  
  const filteredDeliveries = deliveries.filter(delivery => {
    if (!currentReport) return false;
    if (delivery.clientId !== currentReport.clientId) return false;
    
    const deliveryDate = new Date(delivery.deliveryDate);
    const startDate = new Date(currentReport.startDate);
    const endDate = new Date(currentReport.endDate);
    
    return deliveryDate >= startDate && deliveryDate <= endDate;
  }) as unknown as TypedDelivery[];

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
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
                    clients={filteredClients}
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
        
        {reportLoading ? (
          <Card>
            <CardContent className="py-6">
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        ) : currentReport ? (
          <>
            <ReportSummary report={currentReport} />
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
    </AppLayout>
  );
};

export default Reports;
