
import { FinancialReport } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useClients } from '@/contexts';

interface RecentReportsTableProps {
  topReports: FinancialReport[];
}

export const RecentReportsTable = ({ topReports }: RecentReportsTableProps) => {
  const { clients } = useClients();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios com Maior Valor (Top 5)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Período</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhum relatório encontrado
                </TableCell>
              </TableRow>
            ) : (
              topReports.map((report) => {
                const client = clients.find(c => c.id === report.clientId);
                return (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{client?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {format(new Date(report.startDate), 'dd/MM', { locale: ptBR })} até{' '}
                      {format(new Date(report.endDate), 'dd/MM/yy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(report.totalFreight)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
