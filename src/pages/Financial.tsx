
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { useClients } from '@/contexts/ClientsContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FinancialPage = () => {
  const navigate = useNavigate();
  const { financialReports, closeReport } = useFinancial();
  const { clients } = useClients();
  
  // Filtragem dos relatórios - agora todos são abertos
  const openReports = financialReports.filter(report => report.status === 'open');
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const handleCloseReport = (reportId: string) => {
    // Fecha o relatório - agora isso vai removê-lo da lista
    closeReport(reportId);
  };

  const handleViewReport = (reportId: string) => {
    // Navigate to reports page with the specific report ID
    navigate(`/reports?reportId=${reportId}`);
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">
            Gerenciamento dos relatórios financeiros de clientes.
          </p>
        </div>
        
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
              {openReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum relatório em aberto
                  </TableCell>
                </TableRow>
              ) : (
                openReports.map((report) => {
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
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCloseReport(report.id)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Fechar Relatório
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewReport(report.id)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Relatório
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
      </div>
    </AppLayout>
  );
};

export default FinancialPage;
