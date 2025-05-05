
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Trash2 } from 'lucide-react';
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

interface OpenReportsTableProps {
  reports: FinancialReport[];
  isLoading: boolean;
  formatCurrency: (value: number) => string;
  onViewReport: (reportId: string) => void;
  onCloseReport: (report: FinancialReport) => void;
  onDeleteReport: (reportId: string) => void;
}

export const OpenReportsTable = ({
  reports,
  isLoading,
  formatCurrency,
  onViewReport,
  onCloseReport,
  onDeleteReport
}: OpenReportsTableProps) => {
  const { clients = [] } = useClients();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Entregas</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Carregando relatórios...
              </TableCell>
            </TableRow>
          ) : reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhum relatório em aberto
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
                  <TableCell className="text-right">{formatCurrency(report.totalFreight)}</TableCell>
                  <TableCell className="text-right">
                    <ScrollArea className="max-w-[300px] whitespace-nowrap">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onCloseReport(report)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Fechar
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
                          onClick={() => onDeleteReport(report.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </ScrollArea>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
