
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, MoreHorizontal, CreditCard, Edit, FileDown, FileUp, Trash2, Send, Archive } from 'lucide-react';
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
  onSendToReceivables: (report: FinancialReport) => void;
  onArchiveReport: (reportId: string) => void;
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
  getPaymentMethodLabel,
  onSendToReceivables,
  onArchiveReport
}: ClosedReportsTableProps) => {
  const { clients = [] } = useClients();

  return (
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
                            <DropdownMenuItem onClick={() => onEditPaymentDetails(report)}>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Editar detalhes de pagamento
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onReopenReport(report.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Reabrir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onExportPDF(report)}>
                              <FileDown className="h-4 w-4 mr-2" />
                              Exportar PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onExportExcel(report)}>
                              <FileUp className="h-4 w-4 mr-2" />
                              Exportar Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSendToReceivables(report)}>
                              <Send className="h-4 w-4 mr-2" />
                              Enviar para contas a receber
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onArchiveReport(report.id)}>
                              <Archive className="h-4 w-4 mr-2" />
                              Arquivar relatório
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeleteReport(report.id)}
                              className="text-red-500 hover:text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
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
  );
};
