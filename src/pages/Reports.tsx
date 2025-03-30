
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
import { useToast } from '@/components/ui/use-toast';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts/ClientsContext';
import { useCities } from '@/contexts/CitiesContext';
import { useFinancial } from '@/contexts/FinancialContext';
import { Download, FileText, Save } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ReportsPage = () => {
  const { deliveries } = useDeliveries();
  const { clients } = useClients();
  const { cities } = useCities();
  const { addFinancialReport } = useFinancial();
  const { toast } = useToast();
  const [clientFilter, setClientFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  const filteredDeliveries = deliveries.filter((delivery) => {
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

  const handleCityChange = (cityId: string) => {
    setCityFilter(cityId);
    if (cityId && cityId !== 'all') {
      const selectedCity = cities.find(c => c.id === cityId);
      if (selectedCity) {
        // Update distance in UI or use it for calculations
        console.log(`Selected city: ${selectedCity.name} with distance: ${selectedCity.distance} km`);
      }
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFontSize(18);
    doc.text('Relatório de Entregas', 14, 22);
    
    const clientName = clientFilter && clientFilter !== 'all'
      ? clients.find(c => c.id === clientFilter)?.name || 'Cliente não encontrado'
      : 'Todos os clientes';
    doc.text(`Cliente: ${clientName}`, 14, 30);
    doc.text(`Período: ${new Date(startDate).toLocaleDateString('pt-BR')} até ${new Date(endDate).toLocaleDateString('pt-BR')}`, 14, 35);
    
    doc.text(`Quantidade de entregas: ${deliveryCount}`, 14, 40);
    doc.text(`Peso total: ${totalWeight.toFixed(2)} Kg`, 14, 45);
    doc.text(`Frete total: ${formatCurrency(totalFreight)}`, 14, 50);
    
    const tableColumn = ["Minuta", "Data", "Cliente", "Recebedor", "Peso (Kg)", "Frete", "Observações"];
    const tableRows = filteredDeliveries.map((delivery) => {
      const client = clients.find(c => c.id === delivery.clientId);
      return [
        delivery.minuteNumber,
        new Date(delivery.deliveryDate).toLocaleDateString('pt-BR'),
        client?.name || 'N/A',
        delivery.receiver,
        delivery.weight.toFixed(2),
        formatCurrency(delivery.totalFreight),
        delivery.notes || ''
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'striped',
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
        'Tipo': delivery.deliveryType,
        'Carga': delivery.cargoType,
        'Distância (Km)': delivery.distance || 'N/A',
        'Observações': delivery.notes || ''
      };
    });
    
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
      { wch: 15 },
      { wch: 30 },
    ];
    worksheet["!cols"] = colWidths;
    
    XLSX.writeFile(workbook, `relatorio-entregas-${format(new Date(), 'yyyyMMdd')}.xlsx`);
  };

  const saveFinancialReport = () => {
    if (clientFilter && clientFilter !== 'all') {
      const newReportId = addFinancialReport({
        clientId: clientFilter,
        startDate,
        endDate,
        totalFreight,
        totalDeliveries: deliveryCount,
        status: 'open',
      });
      
      toast({
        title: "Relatório financeiro criado",
        description: "O relatório foi salvo e está disponível na seção Financeiro.",
      });
    } else {
      toast({
        title: "Selecione um cliente",
        description: "É necessário filtrar por um cliente específico para criar um relatório financeiro.",
        variant: "destructive"
      });
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <SelectItem value="all">Todos os clientes</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="city">Cidade (Porta a Porta)</Label>
            <Select 
              value={cityFilter} 
              onValueChange={handleCityChange}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione uma cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name} ({city.distance} km)
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
          <Button
            variant="outline"
            onClick={saveFinancialReport}
            disabled={!clientFilter || clientFilter === 'all'}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar para Financeiro
          </Button>
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
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
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
                      <TableCell>{delivery.notes || '-'}</TableCell>
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
