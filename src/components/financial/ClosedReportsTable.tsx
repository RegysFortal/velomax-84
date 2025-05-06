
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, FileText, FileDown, FileUp, Trash2, CreditCard } from 'lucide-react';
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

interface ClosedReportsTableProps {
  reports: FinancialReport[];
  isLoading: boolean;
  formatCurrency: (value: number) => string;
  onViewReport: (reportId: string) => void;
  onReopenReport: (reportId: string) => void;
  onExportPDF: (report: FinancialReport) => void;
  onExportExcel: (report: FinancialReport) => void;
  onDeleteReport: (reportId: string) => void;
  onEditPaymentDetails: (report: FinancialReport) => void;
  getPaymentMethodLabel: (method?: string) => string;
}

export const ClosedReportsTable = ({
  reports,
  isLoading,
  formatCurrency,
  onViewReport,
  onReopenReport,
  onExportPDF,
  onExportExcel,
  onDeleteReport,
  onEditPaymentDetails,
  getPaymentMethodLabel
}: ClosedReportsTableProps) => {
  const { clients = [] } = useClients();

  return (
    <ScrollArea className="w-full border rounded-md">
      <div className="min-w-[1200px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Entregas</TableHead>
              <TableHead>Método de Pagamento</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Carregando relatórios...
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhum relatório fechado
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => {
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
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditPaymentDetails(report)}
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReopenReport(report.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Reabrir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewReport(report.id)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onExportPDF(report)}
                        >
                          <FileDown className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onExportExcel(report)}
                        >
                          <FileUp className="h-4 w-4 mr-1" />
                          Excel
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onDeleteReport(report.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};
