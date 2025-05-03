
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    const doc = new jsPDF();
    
    // Add title centered
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("RELATÓRIO DE FECHAMENTO", 105, 20, { align: 'center' });
    
    // Add client name and period
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${client?.name || 'N/A'}`, 14, 35);
    doc.text(`Período: ${format(new Date(currentReport.startDate), 'dd/MM/yyyy', { locale: ptBR })} até ${format(new Date(currentReport.endDate), 'dd/MM/yyyy', { locale: ptBR })}`, 14, 42);
    doc.text(`Valor Total: ${formatCurrency(currentReport.totalFreight)}`, 14, 49);
    
    // Create table with all required fields
    autoTable(doc, {
      startY: 60,
      head: [['Minuta', 'Data de Entrega', 'Hora', 'Peso (kg)', 'Valor do Frete', 'Observações']],
      body: filteredDeliveries.map(delivery => [
        delivery.minuteNumber,
        format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }),
        delivery.deliveryTime || '-',
        delivery.weight.toString(),
        formatCurrency(delivery.totalFreight),
        delivery.notes || '-'
      ]),
    });
    
    const reportMonth = format(new Date(currentReport.startDate), 'MMMM_yyyy', { locale: ptBR });
    doc.save(`relatorio_fechamento_${client?.name || 'cliente'}_${reportMonth}.pdf`);
  };
  
  const handleExportExcel = () => {
    if (!currentReport) return;
    
    const client = clients.find(c => c.id === currentReport.clientId);
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['RELATÓRIO DE FECHAMENTO'],
      [],
      [`Cliente: ${client?.name || 'N/A'}`],
      [`Período: ${format(new Date(currentReport.startDate), 'dd/MM/yyyy', { locale: ptBR })} até ${format(new Date(currentReport.endDate), 'dd/MM/yyyy', { locale: ptBR })}`],
      [`Valor Total: ${formatCurrency(currentReport.totalFreight)}`],
      [],
      ['Minuta', 'Data de Entrega', 'Hora', 'Peso (kg)', 'Valor do Frete', 'Observações']
    ]);
    
    const data = filteredDeliveries.map(delivery => [
      delivery.minuteNumber,
      format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }),
      delivery.deliveryTime || '-',
      delivery.weight,
      delivery.totalFreight,
      delivery.notes || '-'
    ]);
    
    XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 7 });
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    const reportMonth = format(new Date(currentReport.startDate), 'MMMM_yyyy', { locale: ptBR });
    XLSX.writeFile(workbook, `relatorio_fechamento_${client?.name || 'cliente'}_${reportMonth}.xlsx`);
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
