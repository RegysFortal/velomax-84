
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts/ClientsContext';
import { useFinancial } from '@/contexts/FinancialContext';
import { Download, FileText, Save } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Delivery } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { toast } from 'sonner';

const ReportsPage = () => {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  
  const { deliveries } = useDeliveries();
  const { clients } = useClients();
  const { addFinancialReport, financialReports, getFinancialReport } = useFinancial();
  const { toast: uiToast } = useToast();
  const [clientFilter, setClientFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isViewingClosedReport, setIsViewingClosedReport] = useState(false);

  // If a reportId is provided in the URL, load that report
  useEffect(() => {
    if (reportId) {
      const report = getFinancialReport(reportId);
      if (report && report.status === 'closed') {
        setIsViewingClosedReport(true);
        setClientFilter(report.clientId);
        setStartDate(report.startDate);
        setEndDate(report.endDate);
      }
    }
  }, [reportId, getFinancialReport]);

  // Exclude deliveries that are already in open financial reports, unless we're viewing a closed report
  const existingReportDeliveries = !isViewingClosedReport ? 
    financialReports
      .filter(report => report.status === 'open')
      .flatMap(report => {
        const reportStartDate = new Date(report.startDate);
        const reportEndDate = new Date(report.endDate);
        reportEndDate.setHours(23, 59, 59, 999);
        
        return deliveries.filter(delivery => 
          delivery.clientId === report.clientId &&
          new Date(delivery.deliveryDate) >= reportStartDate &&
          new Date(delivery.deliveryDate) <= reportEndDate
        );
      })
      .map(delivery => delivery.id) : [];

  const filteredDeliveries = deliveries.filter((delivery) => {
    // If viewing a closed report by ID, don't filter out deliveries in reports
    if (!isViewingClosedReport && existingReportDeliveries.includes(delivery.id)) {
      return false;
    }
    
    if (clientFilter && clientFilter !== 'all' && delivery.clientId !== clientFilter) {
      return false;
    }
    
    const deliveryDate = new Date(delivery.deliveryDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return deliveryDate >= start && deliveryDate <= end;
  }).sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalFreight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.totalFreight, 0);
  const totalWeight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.weight, 0);
  const deliveryCount = filteredDeliveries.length;

  const getDeliveryTypeName = (type: Delivery['deliveryType']) => {
    const types: Record<Delivery['deliveryType'], string> = {
      'standard': 'Normal',
      'emergency': 'Emergencial',
      'saturday': 'Sábados',
      'exclusive': 'Exclusivo',
      'difficultAccess': 'Difícil Acesso',
      'metropolitanRegion': 'Região Metropolitana',
      'sundayHoliday': 'Domingos/Feriados',
      'normalBiological': 'Biológico Normal',
      'infectiousBiological': 'Biológico Infeccioso',
      'tracked': 'Rastreado',
      'doorToDoorInterior': 'Porta a Porta',
      'reshipment': 'Redespacho',
    };
    return types[type] || type;
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFontSize(18);
    doc.text("RELATÓRIO DE ENTREGAS", doc.internal.pageSize.width / 2, 15, { align: "center" });
    
    doc.setFontSize(10);
    doc.text("VELOMAX TRANSPORTES LTDA", 14, 25);
    doc.text("CNPJ: 00.000.000/0001-00", 14, 30);
    doc.text("Av. Exemplo, 1000 - Fortaleza - CE", 14, 35);
    
    const clientName = clientFilter && clientFilter !== 'all'
      ? clients.find(c => c.id === clientFilter)?.name || 'Cliente não encontrado'
      : 'TODOS OS CLIENTES';
    
    doc.text(`CLIENTE: ${clientName.toUpperCase()}`, 14, 45);
    doc.text(`PERÍODO: ${new Date(startDate).toLocaleDateString('pt-BR')} até ${new Date(endDate).toLocaleDateString('pt-BR')}`, 14, 50);
    
    const tableColumn = ["Minuta", "Data", "Recebedor", "Peso (Kg)", "Frete", "Tipo", "Observações"];
    const tableRows = filteredDeliveries.map((delivery) => {
      return [
        delivery.minuteNumber,
        new Date(delivery.deliveryDate).toLocaleDateString('pt-BR'),
        delivery.receiver,
        delivery.weight.toFixed(2),
        formatCurrency(delivery.totalFreight),
        getDeliveryTypeName(delivery.deliveryType),
        delivery.notes || ''
      ];
    });

    tableRows.push([
      '', '', '', '', formatCurrency(totalFreight), '', ''
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'striped',
      foot: [['', '', '', 'TOTAL:', formatCurrency(totalFreight), '', '']]
    });
    
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }
    
    doc.save(`relatorio-entregas-${format(new Date(), 'yyyyMMdd')}.pdf`);
  };

  const exportToExcel = () => {
    const excelData = filteredDeliveries.map((delivery) => {
      const client = clients.find(c => c.id === delivery.clientId);
      return {
        'Minuta': delivery.minuteNumber,
        'Data': new Date(delivery.deliveryDate).toLocaleDateString('pt-BR'),
        'Hora': delivery.deliveryTime,
        'Cliente': client?.name || 'N/A',
        'Recebedor': delivery.receiver,
        'Peso (Kg)': delivery.weight.toFixed(2),
        'Frete': formatCurrency(delivery.totalFreight),
        'Tipo': getDeliveryTypeName(delivery.deliveryType),
        'Carga': delivery.cargoType === 'perishable' ? 'Perecível' : 'Padrão',
        'Observações': delivery.notes || ''
      };
    });
    
    excelData.push({
      'Minuta': '',
      'Data': '',
      'Hora': '',
      'Cliente': '',
      'Recebedor': 'TOTAL',
      'Peso (Kg)': '',
      'Frete': formatCurrency(totalFreight),
      'Tipo': '',
      'Carga': '',
      'Observações': ''
    } as any);
    
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entregas");
    
    const colWidths = [
      { wch: 15 },
      { wch: 12 },
      { wch: 8 },
      { wch: 30 },
      { wch: 20 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 30 },
    ];
    worksheet["!cols"] = colWidths;
    
    XLSX.writeFile(workbook, `relatorio-entregas-${format(new Date(), 'yyyyMMdd')}.xlsx`);
  };

  const saveFinancialReport = () => {
    if (clientFilter && clientFilter !== 'all') {
      const client = clients.find(c => c.id === clientFilter);
      if (!client) {
        uiToast({
          title: "Cliente não encontrado",
          description: "Não foi possível encontrar o cliente selecionado.",
          variant: "destructive"
        });
        return;
      }
      
      const reportTitle = `Relatório ${client.name} - ${format(new Date(startDate), 'dd/MM/yyyy')} a ${format(new Date(endDate), 'dd/MM/yyyy')}`;
      
      addFinancialReport({
        title: reportTitle,
        description: `Relatório financeiro para ${client.name}`,
        clientId: clientFilter,
        startDate,
        endDate,
        totalRevenue: totalFreight,
        totalExpenses: 0,
        profit: totalFreight,
        status: 'open',
        totalFreight,
        totalDeliveries: deliveryCount,
      });
      
      uiToast({
        title: "Relatório financeiro criado",
        description: "O relatório foi salvo e está disponível na seção Financeiro.",
      });
    } else {
      uiToast({
        title: "Selecione um cliente",
        description: "É necessário filtrar por um cliente específico para criar um relatório financeiro.",
        variant: "destructive"
      });
    }
  };

  const resetReportForm = () => {
    setSelectedClient('');
    setDateRange({ from: null, to: null });
  };

  const generateReport = async (reportData: any) => {
    console.log('Generating report with data:', reportData);
    return true;
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      const reportData = {
        clientId: selectedClient,
        startDate: dateRange.from?.toISOString().split('T')[0] || '',
        endDate: dateRange.to?.toISOString().split('T')[0] || '',
        totalDeliveries: 0,
        totalFreight: 0,
        status: 'open' as const,
      };
      
      await generateReport(reportData);
      
      toast.success('Relatório gerado com sucesso');
      setIsReportDialogOpen(false);
      resetReportForm();
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Gere relatórios de entregas por cliente e período.
          </p>
        </div>
        
        {!isViewingClosedReport && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="client">Cliente</Label>
              <div className="mt-1">
                <ClientSearchSelect
                  value={clientFilter}
                  onValueChange={setClientFilter}
                  includeAllOption={true}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="startDate">Data inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
                disabled={isViewingClosedReport}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
                disabled={isViewingClosedReport}
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 justify-end">
          {!isViewingClosedReport && (
            <Button
              variant="outline"
              onClick={saveFinancialReport}
              disabled={!clientFilter || clientFilter === 'all'}
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar para Financeiro
            </Button>
          )}
          <Button onClick={exportToPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
        
        {isViewingClosedReport && reportId && (
          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="font-semibold">Visualizando relatório fechado</p>
            {(() => {
              const report = getFinancialReport(reportId);
              const client = report ? clients.find(c => c.id === report.clientId) : null;
              return report ? (
                <div className="text-sm text-muted-foreground">
                  <p>Cliente: {client?.name || 'N/A'}</p>
                  <p>Período: {format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} até {format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
                  <p>Total: {formatCurrency(report.totalFreight)}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Relatório não encontrado</p>
              );
            })()}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted p-6 rounded-lg">
            <div className="text-sm text-muted-foreground">Total de entregas</div>
            <div className="text-3xl font-bold">{deliveryCount}</div>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <div className="text-sm text-muted-foreground">Peso total</div>
            <div className="text-3xl font-bold">{totalWeight.toFixed(2)} Kg</div>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <div className="text-sm text-muted-foreground">Frete total</div>
            <div className="text-3xl font-bold">{formatCurrency(totalFreight)}</div>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-480px)]">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Minuta</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Recebedor</TableHead>
                  <TableHead className="text-right">Peso</TableHead>
                  <TableHead className="text-right">Frete</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeliveries.map((delivery) => {
                    const client = clients.find(c => c.id === delivery.clientId);
                    return (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.minuteNumber}</TableCell>
                        <TableCell>{new Date(delivery.deliveryDate).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{client?.name || 'N/A'}</TableCell>
                        <TableCell>{delivery.receiver}</TableCell>
                        <TableCell className="text-right">{delivery.weight.toFixed(2)} Kg</TableCell>
                        <TableCell className="text-right">{formatCurrency(delivery.totalFreight)}</TableCell>
                        <TableCell>{getDeliveryTypeName(delivery.deliveryType)}</TableCell>
                        <TableCell>{delivery.notes || '-'}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
