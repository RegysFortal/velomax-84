
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
import { Logo } from '@/components/ui/logo';

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
  const [companyData, setCompanyData] = useState(() => {
    const storedData = localStorage.getItem('company_settings');
    return storedData ? JSON.parse(storedData) : {
      name: 'VeloMax Transportes',
      cnpj: '12.345.678/0001-90',
      address: 'Av. Principal, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000-000',
      phone: '(11) 1234-5678',
      email: 'contato@velomax.com',
      website: 'www.velomax.com',
      description: 'Empresa especializada em transporte de cargas.'
    };
  });
  
  // Defina a função para obter entregas não fechadas
  const getUnreportedDeliveriesByClient = () => {
    // Encontre todos os relatórios fechados
    const closedReports = financialReports.filter(report => report.status === 'closed');
    
    // Criar um Set para rastrear quais entregas já estão em relatórios fechados
    const deliveriesInClosedReports = new Set();
    
    // Preencher o Set com entregas em relatórios fechados
    closedReports.forEach(report => {
      // Filtrar entregas para este cliente dentro do período do relatório
      const reportStartDate = new Date(report.startDate);
      const reportEndDate = new Date(report.endDate);
      
      // Configure as horas para garantir comparações corretas
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
    
    // Filtrar entregas que não estão em relatórios fechados
    const unreportedDeliveries = deliveries.filter(
      delivery => !deliveriesInClosedReports.has(delivery.id)
    );
    
    // Retornar IDs de clientes com entregas não reportadas
    const clientIds = new Set(unreportedDeliveries.map(d => d.clientId));
    return Array.from(clientIds);
  };
  
  // Filtrar clientes com entregas não fechadas quando o componente carrega
  // ou quando deliveries/financialReports mudam
  useEffect(() => {
    if (clients.length > 0 && deliveries.length > 0) {
      const clientsWithUnreportedDeliveries = getUnreportedDeliveriesByClient();
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
      const clientsWithUnreportedDeliveries = getUnreportedDeliveriesByClient();
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
    const doc = new jsPDF();
    
    // Add logo at the top
    const logoImg = document.querySelector('.company-logo') as HTMLImageElement;
    if (logoImg) {
      // Convert SVG to data URL for PDF
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const svgString = new XMLSerializer().serializeToString(logoImg);
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 50, 10, 100, 80);
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
      }
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 30, 30);
    }
    
    // Add company information
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${companyData.name}`, 50, 15);
    doc.text(`CNPJ: ${companyData.cnpj}`, 50, 20);
    doc.text(`${companyData.address}, ${companyData.city} - ${companyData.state}, ${companyData.zipCode}`, 50, 25);
    doc.text(`Tel: ${companyData.phone} | Email: ${companyData.email}`, 50, 30);
    doc.text(`${companyData.website}`, 50, 35);
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(10, 40, 200, 40);
    
    // Add title centered
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("RELATÓRIO DE FECHAMENTO", 105, 50, { align: 'center' });
    
    // Add client name and period
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${client?.name || 'N/A'}`, 14, 60);
    doc.text(`Período: ${format(new Date(currentReport.startDate), 'dd/MM/yyyy', { locale: ptBR })} até ${format(new Date(currentReport.endDate), 'dd/MM/yyyy', { locale: ptBR })}`, 14, 67);
    doc.text(`Valor Total: ${formatCurrency(currentReport.totalFreight)}`, 14, 74);
    
    // Create table with all required fields
    autoTable(doc, {
      startY: 85,
      head: [['Minuta', 'Data de Entrega', 'Hora', 'Recebedor', 'Peso (kg)', 'Valor do Frete', 'Observações']],
      body: filteredDeliveries.map(delivery => [
        delivery.minuteNumber,
        format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }),
        delivery.deliveryTime || '-',
        delivery.receiver || '-',
        delivery.weight.toString(),
        formatCurrency(delivery.totalFreight),
        delivery.notes || '-'
      ]),
    });
    
    // Nome do arquivo: Relatorio + nome do cliente + mês
    const reportMonth = format(new Date(currentReport.startDate), 'MMMM_yyyy', { locale: ptBR });
    const fileName = `Relatorio_${client?.name.replace(/\s+/g, '_') || 'cliente'}_${reportMonth}.pdf`;
    doc.save(fileName);
  };
  
  const handleExportExcel = () => {
    if (!currentReport) return;
    
    const client = clients.find(c => c.id === currentReport.clientId);
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      [`${companyData.name}`],
      [`CNPJ: ${companyData.cnpj}`],
      [`${companyData.address}, ${companyData.city} - ${companyData.state}, ${companyData.zipCode}`],
      [`Tel: ${companyData.phone} | Email: ${companyData.email}`],
      [`${companyData.website}`],
      [],
      ['RELATÓRIO DE FECHAMENTO'],
      [],
      [`Cliente: ${client?.name || 'N/A'}`],
      [`Período: ${format(new Date(currentReport.startDate), 'dd/MM/yyyy', { locale: ptBR })} até ${format(new Date(currentReport.endDate), 'dd/MM/yyyy', { locale: ptBR })}`],
      [`Valor Total: ${formatCurrency(currentReport.totalFreight)}`],
      [],
      ['Minuta', 'Data de Entrega', 'Hora', 'Recebedor', 'Peso (kg)', 'Valor do Frete', 'Observações']
    ]);
    
    const data = filteredDeliveries.map(delivery => [
      delivery.minuteNumber,
      format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }),
      delivery.deliveryTime || '-',
      delivery.receiver || '-',
      delivery.weight,
      delivery.totalFreight,
      delivery.notes || '-'
    ]);
    
    XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 13 });
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    // Nome do arquivo: Relatorio + nome do cliente + mês 
    const reportMonth = format(new Date(currentReport.startDate), 'MMMM_yyyy', { locale: ptBR });
    const fileName = `Relatorio_${client?.name.replace(/\s+/g, '_') || 'cliente'}_${reportMonth}.xlsx`;
    XLSX.writeFile(workbook, fileName);
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
