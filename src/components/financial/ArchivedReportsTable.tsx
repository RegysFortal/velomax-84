
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, MoreHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FinancialReport } from '@/types';
import { useClients } from '@/contexts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchWithMagnifier } from '@/components/ui/search-with-magnifier';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface ArchivedReportsTableProps {
  reports: FinancialReport[];
  isLoading: boolean;
  formatCurrency: (value: number) => string;
  onViewReport: (reportId: string) => void;
  onExportPDF: (report: FinancialReport) => void;
  onExportExcel: (report: FinancialReport) => void;
  getPaymentMethodLabel: (method?: string) => string;
  onReturnToClosed: (reportId: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export const ArchivedReportsTable = ({
  reports,
  isLoading,
  formatCurrency,
  onViewReport,
  onExportPDF,
  onExportExcel,
  getPaymentMethodLabel,
  onReturnToClosed,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: ArchivedReportsTableProps) => {
  const { clients = [] } = useClients();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter reports by date range and search query
  const filteredReports = reports.filter((report) => {
    const client = clients.find(c => c.id === report.clientId);
    const clientName = client?.name?.toLowerCase() || '';
    const reportDate = new Date(report.createdAt || '');
    const reportStartDate = new Date(report.startDate);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    const matchesSearch = clientName.includes(searchQuery.toLowerCase()) || 
                          report.id.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesDateRange = reportStartDate >= startDateObj && 
                            reportStartDate <= endDateObj;
    
    // Always return true for empty search, otherwise check if matches
    const searchMatches = searchQuery === "" || matchesSearch;
    const dateMatches = matchesDateRange;

    return searchMatches && dateMatches;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchWithMagnifier
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por cliente..."
          className="max-w-sm"
        />
        
        <div className="flex gap-2 items-center">
          <div className="grid gap-1">
            <Label htmlFor="startDate">Data inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="h-9 w-[130px]"
            />
          </div>
          <span className="text-muted-foreground">até</span>
          <div className="grid gap-1">
            <Label htmlFor="endDate">Data final</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="h-9 w-[130px]"
            />
          </div>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <ScrollArea className="h-[calc(100vh-350px)] overflow-x-auto" type="always">
          <div className="w-full min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Entregas</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Carregando relatórios...
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Nenhum relatório arquivado encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => {
                    const client = clients.find(c => c.id === report.clientId);
                    return (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{client?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} até {' '}
                          {format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>{report.totalDeliveries}</TableCell>
                        <TableCell>{getPaymentMethodLabel(report.paymentMethod)}</TableCell>
                        <TableCell>
                          {report.dueDate 
                            ? format(new Date(report.dueDate), 'dd/MM/yyyy', { locale: ptBR }) 
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(report.totalFreight)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-popover">
                              <DropdownMenuItem onClick={() => onViewReport(report.id)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Visualizar relatório
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onReturnToClosed(report.id)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Retornar para Fechados
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onExportPDF(report)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Exportar PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onExportExcel(report)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Exportar Excel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
