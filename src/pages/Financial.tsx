
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
import { useClients } from '@/contexts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';

const FinancialPage = () => {
  const navigate = useNavigate();
  
  // Initialize with empty arrays, then try to get data from context
  const [financialReports, setFinancialReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState("open");
  
  try {
    const { financialReports: contextReports, loading } = useFinancial();
    if (contextReports) {
      setFinancialReports(contextReports);
      setIsLoading(loading);
    }
  } catch (error) {
    console.warn("FinancialProvider not available");
  }
  
  try {
    const { clients: contextClients } = useClients();
    if (contextClients) {
      setClients(contextClients);
    }
  } catch (error) {
    console.warn("ClientsProvider not available");
  }
  
  // Function to close a report - with safe fallback
  const closeReport = async (reportId) => {
    try {
      const { closeReport: contextCloseReport } = useFinancial();
      if (typeof contextCloseReport === 'function') {
        await contextCloseReport(reportId);
      } else {
        console.warn("closeReport function not available");
      }
    } catch (error) {
      console.warn("Error closing report:", error);
    }
  };
  
  // Filtragem dos relatórios por status
  const openReports = financialReports.filter(report => report.status === 'open');
  const closedReports = financialReports.filter(report => report.status === 'closed');
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const handleCloseReport = (reportId: string) => {
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="open">Relatórios a Fechar</TabsTrigger>
            <TabsTrigger value="closed">Relatórios Fechados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="open" className="space-y-4">
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
                  ) : openReports.length === 0 ? (
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
          </TabsContent>
          
          <TabsContent value="closed" className="space-y-4">
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
                  ) : closedReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Nenhum relatório fechado
                      </TableCell>
                    </TableRow>
                  ) : (
                    closedReports.map((report) => {
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
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewReport(report.id)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Ver Relatório
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default FinancialPage;
