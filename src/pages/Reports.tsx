
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts/ClientsContext';
import { CalendarIcon, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { format, isAfter, isBefore, isSameMonth, setDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend jsPDF to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const Reports = () => {
  const { deliveries } = useDeliveries();
  const { clients } = useClients();
  const [clientId, setClientId] = useState<string>('');
  const [reportType, setReportType] = useState<string>('monthly');
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date());
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());

  // Format functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Get filtered data
  const getFilteredData = () => {
    return deliveries.filter((delivery) => {
      // Client filter
      if (clientId && delivery.clientId !== clientId) {
        return false;
      }

      const deliveryDate = new Date(delivery.deliveryDate);

      // Date filter
      if (reportType === 'monthly' && month) {
        return isSameMonth(deliveryDate, month);
      } else if (reportType === 'custom' && dateFrom && dateTo) {
        const dateFromStart = new Date(dateFrom);
        dateFromStart.setHours(0, 0, 0, 0);
        
        const dateToEnd = new Date(dateTo);
        dateToEnd.setHours(23, 59, 59, 999);
        
        return isAfter(deliveryDate, dateFromStart) && isBefore(deliveryDate, dateToEnd);
      }

      return true;
    });
  };

  const filteredData = getFilteredData();

  // Calculate summary data
  const totalFreight = filteredData.reduce((sum, item) => sum + item.totalFreight, 0);
  const totalWeight = filteredData.reduce((sum, item) => sum + item.weight, 0);
  const averageFreight = filteredData.length ? totalFreight / filteredData.length : 0;

  // Export to PDF
  const exportToPdf = () => {
    const doc = new jsPDF();
    
    // Add logo and header
    doc.setFontSize(20);
    doc.text('Relatório de Entregas - Velomax Brasil', 20, 20);
    
    // Add report filters
    doc.setFontSize(12);
    const selectedClient = clients.find(c => c.id === clientId);
    doc.text(`Cliente: ${selectedClient?.name || 'Todos os clientes'}`, 20, 30);
    
    if (reportType === 'monthly' && month) {
      doc.text(`Período: ${format(month, 'MMMM yyyy', { locale: ptBR })}`, 20, 38);
    } else if (reportType === 'custom' && dateFrom && dateTo) {
      doc.text(`Período: ${format(dateFrom, 'dd/MM/yyyy')} a ${format(dateTo, 'dd/MM/yyyy')}`, 20, 38);
    }
    
    // Add summary
    doc.text(`Total de entregas: ${filteredData.length}`, 20, 46);
    doc.text(`Peso total: ${totalWeight.toFixed(2)} Kg`, 20, 54);
    doc.text(`Frete total: ${formatCurrency(totalFreight)}`, 20, 62);
    doc.text(`Frete médio: ${formatCurrency(averageFreight)}`, 20, 70);
    
    // Add table
    const tableColumn = ["Minuta", "Data", "Hora", "Recebedor", "Peso (Kg)", "Frete"];
    const tableRows = filteredData.map(item => [
      item.minuteNumber,
      format(new Date(item.deliveryDate), 'dd/MM/yyyy'),
      item.deliveryTime,
      item.receiver,
      item.weight.toFixed(2),
      formatCurrency(item.totalFreight)
    ]);
    
    doc.setFontSize(12);
    doc.text('Detalhe das Entregas', 20, 85);
    
    // Add the table
    doc.autoTable({
      startY: 90,
      head: [tableColumn],
      body: tableRows,
      headStyles: {
        fillColor: [30, 58, 138], // Velomax blue
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
      },
      margin: { top: 90 }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Página ${i} de ${pageCount} - Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
        doc.internal.pageSize.width / 2, 
        doc.internal.pageSize.height - 10, 
        { align: 'center' }
      );
    }
    
    // Save the PDF
    let filename = 'relatorio-entregas';
    if (selectedClient) {
      filename += `-${selectedClient.name.replace(/\s+/g, '-').toLowerCase()}`;
    }
    if (reportType === 'monthly' && month) {
      filename += `-${format(month, 'yyyy-MM')}`;
    }
    filename += '.pdf';
    
    doc.save(filename);
  };

  // Export to Excel
  const exportToExcel = () => {
    // Prepare data for Excel
    const excelData = filteredData.map(item => {
      const client = clients.find(c => c.id === item.clientId);
      return {
        'Minuta': item.minuteNumber,
        'Data': format(new Date(item.deliveryDate), 'dd/MM/yyyy'),
        'Hora': item.deliveryTime,
        'Cliente': client?.name || 'N/A',
        'Recebedor': item.receiver,
        'Peso (Kg)': item.weight.toFixed(2),
        'Frete': item.totalFreight.toFixed(2),
      };
    });
    
    // Create a summary worksheet
    const summaryData = [
      ['Relatório de Entregas - Velomax Brasil'],
      [],
      ['Cliente:', clients.find(c => c.id === clientId)?.name || 'Todos os clientes'],
      ['Período:', reportType === 'monthly' && month 
        ? format(month, 'MMMM yyyy', { locale: ptBR })
        : reportType === 'custom' && dateFrom && dateTo 
          ? `${format(dateFrom, 'dd/MM/yyyy')} a ${format(dateTo, 'dd/MM/yyyy')}`
          : 'Todos'
      ],
      [],
      ['Total de entregas:', filteredData.length],
      ['Peso total (Kg):', totalWeight.toFixed(2)],
      ['Frete total:', totalFreight.toFixed(2)],
      ['Frete médio:', averageFreight.toFixed(2)],
      [],
      ['Gerado em:', format(new Date(), 'dd/MM/yyyy HH:mm')],
    ];
    
    // Create worksheet
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    const dataWS = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Resumo');
    XLSX.utils.book_append_sheet(wb, dataWS, 'Entregas');
    
    // Generate filename
    let filename = 'relatorio-entregas';
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      filename += `-${selectedClient.name.replace(/\s+/g, '-').toLowerCase()}`;
    }
    if (reportType === 'monthly' && month) {
      filename += `-${format(month, 'yyyy-MM')}`;
    }
    filename += '.xlsx';
    
    // Export Excel file
    XLSX.writeFile(wb, filename);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Gere relatórios de entregas e fretes em PDF ou Excel.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Relatório</CardTitle>
            <CardDescription>
              Selecione os filtros para gerar o relatório desejado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Cliente</label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os clientes</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tipo de Relatório</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o tipo de relatório" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="custom">Período Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {reportType === 'monthly' && (
              <div>
                <label className="text-sm font-medium">Mês</label>
                <div className="mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !month && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {month ? format(month, 'MMMM yyyy', { locale: ptBR }) : "Selecione um mês"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={month}
                        onSelect={setMonth}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            
            {reportType === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data Inicial</label>
                  <div className="mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, 'P', { locale: ptBR }) : "Selecione a data inicial"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Data Final</label>
                  <div className="mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, 'P', { locale: ptBR }) : "Selecione a data final"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                          disabled={(date) => 
                            dateFrom ? isBefore(date, dateFrom) : false
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm">
              {filteredData.length} entregas encontradas
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={exportToPdf}
                disabled={filteredData.length === 0}
              >
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button
                onClick={exportToExcel}
                disabled={filteredData.length === 0}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Total de Entregas</div>
                <div className="text-2xl font-bold mt-1">{filteredData.length}</div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Peso Total</div>
                <div className="text-2xl font-bold mt-1">{totalWeight.toFixed(2)} Kg</div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Frete Total</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(totalFreight)}</div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Frete Médio</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(averageFreight)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {filteredData.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Prévia dos Dados</CardTitle>
              <CardDescription>
                Mostrando os primeiros 5 registros do relatório
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Minuta</th>
                      <th className="text-left py-3 px-4">Data</th>
                      <th className="text-left py-3 px-4">Cliente</th>
                      <th className="text-left py-3 px-4">Recebedor</th>
                      <th className="text-right py-3 px-4">Peso</th>
                      <th className="text-right py-3 px-4">Frete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 5).map((item) => {
                      const client = clients.find(c => c.id === item.clientId);
                      return (
                        <tr key={item.id} className="border-b">
                          <td className="py-2 px-4">{item.minuteNumber}</td>
                          <td className="py-2 px-4">{format(new Date(item.deliveryDate), 'dd/MM/yyyy')}</td>
                          <td className="py-2 px-4">{client?.name || 'N/A'}</td>
                          <td className="py-2 px-4">{item.receiver}</td>
                          <td className="py-2 px-4 text-right">{item.weight.toFixed(2)} Kg</td>
                          <td className="py-2 px-4 text-right">{formatCurrency(item.totalFreight)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={exportToPdf}
              >
                <Download className="mr-2 h-4 w-4" />
                Visualizar Relatório Completo
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Reports;
