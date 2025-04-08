
import { useState } from 'react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { useClients } from '@/contexts/ClientsContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FinancialPage = () => {
  const navigate = useNavigate();
  const { financialReports, closeReport, deleteFinancialReport } = useFinancial();
  const { clients } = useClients();
  const [currentTab, setCurrentTab] = useState("open");
  
  // Filtragem dos relatórios
  const openReports = financialReports.filter(report => report.status === 'open');
  const closedReports = financialReports.filter(report => report.status === 'closed');
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const handleCloseReport = (reportId: string) => {
    // Fecha o relatório
    closeReport(reportId);
    // Define a tab para "closed" para mostrar os relatórios fechados
    setCurrentTab("closed");
  };

  const handleViewReport = (reportId: string) => {
    // Navigate to reports page with the specific report ID
    navigate(`/reports?reportId=${reportId}`);
  };
  
  const handleExportPDF = (report: any) => {
    const client = clients.find(c => c.id === report.clientId);
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFontSize(18);
    doc.text("RELATÓRIO FINANCEIRO", doc.internal.pageSize.width / 2, 15, { align: "center" });
    
    doc.setFontSize(10);
    doc.text("VELOMAX TRANSPORTES LTDA", 14, 25);
    doc.text("CNPJ: 00.000.000/0001-00", 14, 30);
    doc.text("Av. Exemplo, 1000 - Fortaleza - CE", 14, 35);
    
    doc.text(`CLIENTE: ${client?.name || 'Cliente não encontrado'}`, 14, 45);
    doc.text(`PERÍODO: ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} até ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`, 14, 50);
    doc.text(`STATUS: ${report.status === 'open' ? 'Em aberto' : 'Fechado'}`, 14, 55);
    
    const tableColumn = ["Descrição", "Valor"];
    const tableRows = [
      ["Total de Entregas", report.totalDeliveries.toString()],
      ["Valor Total de Fretes", formatCurrency(report.totalFreight)],
      ["Total de Despesas", formatCurrency(report.totalExpenses || 0)],
      ["Lucro", formatCurrency(report.profit || report.totalFreight)],
    ];
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: 'striped',
    });
    
    doc.text(`Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 14, 120);
    doc.text(`Relatório ${report.status === 'closed' ? 'fechado' : 'gerado'} em: ${format(new Date(report.updatedAt), 'dd/MM/yyyy', { locale: ptBR })}`, 14, 125);
    
    doc.save(`relatorio-financeiro-${client?.name || 'cliente'}-${format(new Date(), 'yyyyMMdd')}.pdf`);
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
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="open">Relatórios em Aberto</TabsTrigger>
            <TabsTrigger value="closed">Relatórios Fechados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="open" className="mt-4">
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
          
          <TabsContent value="closed" className="mt-4">
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
                  {closedReports.length === 0 ? (
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
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewReport(report.id)}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Ver Relatório
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExportPDF(report)}
                              >
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Exportar PDF
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteFinancialReport(report.id)}
                              >
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
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default FinancialPage;
