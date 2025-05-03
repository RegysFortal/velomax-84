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
import { FileText, Edit, FileDown, FileUp, Trash2 } from 'lucide-react';
import { useFinancial } from '@/contexts/financial';
import { useClients } from '@/contexts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';
import { FinancialReport } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/ui/logo';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const FinancialPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("open");
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  
  // Get financial data safely with fallbacks
  const { financialReports = [], loading: isLoading = false, closeReport, reopenReport, deleteFinancialReport } = useFinancial();
  
  // Get clients data safely with fallbacks
  const { clients = [] } = useClients();
  
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

  const handleReopenReport = (reportId: string) => {
    reopenReport(reportId);
  };

  const handleViewReport = (reportId: string) => {
    // Navigate to reports page with the specific report ID
    navigate(`/reports?reportId=${reportId}`);
  };
  
  const handleExportPDF = (report: FinancialReport) => {
    const client = clients.find(c => c.id === report.clientId);
    const doc = new jsPDF();
    
    // Add logo
    const logoWidth = 40;
    doc.setFontSize(12);
    
    // Add title
    doc.setFont('helvetica', 'bold');
    doc.text("RELATÓRIO", 105, 20, { align: 'center' });
    
    // Add client name and period
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${client?.name || 'N/A'}`, 14, 35);
    doc.text(`Período: ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} até ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`, 14, 42);
    doc.text(`Total de Entregas: ${report.totalDeliveries}`, 14, 49);
    doc.text(`Valor Total: ${formatCurrency(report.totalFreight)}`, 14, 56);
    
    // Get filtered deliveries for this report
    const filteredDeliveries = deliveriesForReport(report);
    
    // Create table
    autoTable(doc, {
      startY: 70,
      head: [['Minuta', 'Data de Entrega', 'Destinatário', 'Tipo', 'Peso (kg)', 'Valor do Frete']],
      body: filteredDeliveries.map(delivery => [
        delivery.minuteNumber,
        format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }),
        delivery.receiver,
        delivery.deliveryType,
        delivery.weight,
        formatCurrency(delivery.totalFreight)
      ]),
    });
    
    const reportMonth = format(new Date(report.startDate), 'MMMM_yyyy', { locale: ptBR });
    doc.save(`relatorio_financeiro_${client?.name || 'cliente'}_${reportMonth}.pdf`);
  };
  
  const handleExportExcel = (report: FinancialReport) => {
    const client = clients.find(c => c.id === report.clientId);
    const filteredDeliveries = deliveriesForReport(report);
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['RELATÓRIO FINANCEIRO'],
      [`Cliente: ${client?.name || 'N/A'}`],
      [`Período: ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} até ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`],
      [`Total de Entregas: ${report.totalDeliveries}`],
      [`Valor Total: ${formatCurrency(report.totalFreight)}`],
      [],
      ['Minuta', 'Data de Entrega', 'Destinatário', 'Tipo', 'Peso (kg)', 'Valor do Frete']
    ]);
    
    const data = filteredDeliveries.map(delivery => [
      delivery.minuteNumber,
      format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }),
      delivery.receiver,
      delivery.deliveryType,
      delivery.weight,
      delivery.totalFreight
    ]);
    
    XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 7 });
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    const reportMonth = format(new Date(report.startDate), 'MMMM_yyyy', { locale: ptBR });
    XLSX.writeFile(workbook, `relatorio_financeiro_${client?.name || 'cliente'}_${reportMonth}.xlsx`);
  };
  
  const handleDeleteReport = async () => {
    if (reportToDelete) {
      await deleteFinancialReport(reportToDelete);
      setReportToDelete(null);
    }
  };
  
  // Helper function to get deliveries for a specific report
  const deliveriesForReport = (report: FinancialReport) => {
    // This is a stub - should be implemented in DeliveriesContext
    return [];
  };
  
  return (
    <AppLayout>
      <ScrollArea className="h-[calc(100vh-148px)] w-full">
        <div className="flex flex-col gap-6 px-8 py-6">
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
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setReportToDelete(report.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
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
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReopenReport(report.id)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Reabrir
                                </Button>
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
                                  <FileDown className="mr-2 h-4 w-4" />
                                  PDF
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleExportExcel(report)}
                                >
                                  <FileUp className="mr-2 h-4 w-4" />
                                  Excel
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setReportToDelete(report.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
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
      </ScrollArea>
      
      <AlertDialog open={!!reportToDelete} onOpenChange={(open) => !open && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReport}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default FinancialPage;
