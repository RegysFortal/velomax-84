
import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts/ClientsContext';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ReportsPage = () => {
  const { deliveries } = useDeliveries();
  const { clients } = useClients();
  const [clientFilter, setClientFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  // Filter deliveries
  const filteredDeliveries = deliveries.filter((delivery) => {
    // Client filter
    if (clientFilter && delivery.clientId !== clientFilter) {
      return false;
    }
    
    // Date range filter
    const deliveryDate = new Date(delivery.deliveryDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to end of day
    
    return deliveryDate >= start && deliveryDate <= end;
  }).sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calculate totals
  const totalFreight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.totalFreight, 0);
  const totalWeight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.weight, 0);
  const deliveryCount = filteredDeliveries.length;

  const exportToPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Relatório de Entregas', 14, 22);
    
    // Add filters information
    doc.setFontSize(10);
    const clientName = clientFilter 
      ? clients.find(c => c.id === clientFilter)?.name || 'Cliente não encontrado'
      : 'Todos os clientes';
    doc.text(`Cliente: ${clientName}`, 14, 30);
    doc.text(`Período: ${new Date(startDate).toLocaleDateString('pt-BR')} até ${new Date(endDate).toLocaleDateString('pt-BR')}`, 14, 35);
    
    // Add summary
    doc.text(`Quantidade de entregas: ${deliveryCount}`, 14, 40);
    doc.text(`Peso total: ${totalWeight.toFixed(2)} Kg`, 14, 45);
    doc.text(`Frete total: ${formatCurrency(totalFreight)}`, 14, 50);
    
    // Create table data
    const tableColumn = ["Minuta", "Data", "Cliente", "Recebedor", "Peso (Kg)", "Frete"];
    const tableRows = filteredDeliveries.map((delivery) => {
      const client = clients.find(c => c.id === delivery.clientId);
      return [
        delivery.minuteNumber,
        new Date(delivery.deliveryDate).toLocaleDateString('pt-BR'),
        client?.name || 'N/A',
        delivery.receiver,
        delivery.weight.toFixed(2),
        formatCurrency(delivery.totalFreight)
      ];
    });

    // Add table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'striped',
    });
    
    // Add footer with date
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
    
    // Save the PDF
    doc.save(`relatorio-entregas-${format(new Date(), 'yyyyMMdd')}.pdf`);
  };

  const exportToExcel = () => {
    // Prepare data for Excel export
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
        'Tipo': delivery.deliveryType,
        'Carga': delivery.cargoType,
        'Distância (Km)': delivery.distance || 'N/A',
      };
    });
    
    // Add summary row
    excelData.push({
      'Minuta': '',
      'Data': '',
      'Hora': '',
      'Cliente': '',
      'Recebedor': 'TOTAL',
      'Peso (Kg)': totalWeight.toFixed(2),
      'Frete': formatCurrency(totalFreight),
      'Tipo': '',
      'Carga': '',
      'Distância (Km)': '',
    });
    
    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entregas");
    
    // Auto-fit columns
    const colWidths = [
      { wch: 15 }, // Minuta
      { wch: 12 }, // Data
      { wch: 8 }, // Hora
      { wch: 30 }, // Cliente
      { wch: 20 }, // Recebedor
      { wch: 10 }, // Peso
      { wch: 15 }, // Frete
      { wch: 15 }, // Tipo
      { wch: 12 }, // Carga
      { wch: 15 }, // Distância
    ];
    worksheet["!cols"] = colWidths;
    
    // Save the Excel file
    XLSX.writeFile(workbook, `relatorio-entregas-${format(new Date(), 'yyyyMMdd')}.xlsx`);
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="client">Cliente</Label>
            <Select 
              value={clientFilter} 
              onValueChange={setClientFilter}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Todos os clientes" />
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
            <Label htmlFor="startDate">Data inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
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
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-end">
          <Button onClick={exportToPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
        
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
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
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
