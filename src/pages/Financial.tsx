
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
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';
import { FinancialReport } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Logo } from '@/components/ui/logo';
import { getCompanyInfo } from '@/utils/printUtils';

const FinancialPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("open");
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  
  // Get financial data safely with fallbacks
  const { financialReports = [], loading: isLoading = false, closeReport, reopenReport, deleteFinancialReport } = useFinancial();
  
  // Get clients data safely with fallbacks
  const { clients = [] } = useClients();
  
  // Get deliveries data
  const { deliveries = [] } = useDeliveries();
  
  // Get company information
  const companyData = getCompanyInfo();
  
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
    
    // Add logo at the top
    const logoImg = document.querySelector('.company-logo') as HTMLImageElement;
    if (logoImg) {
      // Convert SVG to data URL for PDF
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const svgString = new XMLSerializer().serializeToString(logoImg);
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 50, 10, 100, 80);
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
      }
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 30, 30);
    }
    
    // Add company information
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${companyData.name}`, 50, 15);
    doc.text(`CNPJ: ${companyData.cnpj}`, 50, 20);
    doc.text(`${companyData.address}, ${companyData.city} - ${companyData.state}, ${companyData.zipCode}`, 50, 25);
    doc.text(`Tel: ${companyData.phone} | Email: ${companyData.email}`, 50, 30);
    doc.text(`${companyData.website}`, 50, 35);
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(10, 40, 200, 40);
    
    // Add title centered
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("RELATÓRIO DE FECHAMENTO", 105, 50, { align: 'center' });
    
    // Add client name and period
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${client?.name || 'N/A'}`, 14, 60);
    doc.text(`Período: ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} até ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`, 14, 67);
    doc.text(`Valor Total: ${formatCurrency(report.totalFreight)}`, 14, 74);
    
    // Get filtered deliveries for this report
    const filteredDeliveries = deliveriesForReport(report);
    
    // Create table with all required fields
    autoTable(doc, {
      startY: 85,
      head: [['Minuta', 'Data de Entrega', 'Hora', 'Recebedor', 'Peso (kg)', 'Valor do Frete', 'Observações']],
      body: filteredDeliveries.map(delivery => [
        delivery.minuteNumber,
        format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }),
        delivery.deliveryTime || '-',
        delivery.receiver || '-',
        delivery.weight.toString(),
        formatCurrency(delivery.totalFreight),
        delivery.notes || '-'
      ]),
    });
    
    // Nome do arquivo: Relatorio + nome do cliente + mês
    const reportMonth = format(new Date(report.startDate), 'MMMM_yyyy', { locale: ptBR });
    const fileName = `Relatorio_${client?.name.replace(/\s+/g, '_') || 'cliente'}_${reportMonth}.pdf`;
    doc.save(fileName);
  };
  
  const handleExportExcel = (report: FinancialReport) => {
    const client = clients.find(c => c.id === report.clientId);
    const filteredDeliveries = deliveriesForReport(report);
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      [`${companyData.name}`],
      [`CNPJ: ${companyData.cnpj}`],
      [`${companyData.address}, ${companyData.city} - ${companyData.state}, ${companyData.zipCode}`],
      [`Tel: ${companyData.phone} | Email: ${companyData.email}`],
      [`${companyData.website}`],
      [],
      ['RELATÓRIO DE FECHAMENTO'],
      [],
      [`Cliente: ${client?.name || 'N/A'}`],
      [`Período: ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} até ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`],
      [`Valor Total: ${formatCurrency(report.totalFreight)}`],
      [],
      ['Minuta', 'Data de Entrega', 'Hora', 'Recebedor', 'Peso (kg)', 'Valor do Frete', 'Observações']
    ]);
    
    const data = filteredDeliveries.map(delivery => [
      delivery.minuteNumber,
      format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }),
      delivery.deliveryTime || '-',
      delivery.receiver || '-',
      delivery.weight,
      delivery.totalFreight,
      delivery.notes || '-'
    ]);
    
    XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 13 });
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    // Nome do arquivo: Relatorio + nome do cliente + mês
    const reportMonth = format(new Date(report.startDate), 'MMMM_yyyy', { locale: ptBR });
    const fileName = `Relatorio_${client?.name.replace(/\s+/g, '_') || 'cliente'}_${reportMonth}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  
  const handleDeleteReport = async () => {
    if (reportToDelete) {
      await deleteFinancialReport(reportToDelete);
      setReportToDelete(null);
    }
  };
  
  // Helper function to get deliveries for a specific report
  const deliveriesForReport = (report: FinancialReport) => {
    return deliveries.filter(delivery => {
      if (delivery.clientId !== report.clientId) return false;
      
      const deliveryDate = new Date(delivery.deliveryDate);
      const startDate = new Date(report.startDate);
      const endDate = new Date(report.endDate);
      
      // Set hours to ensure correct comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      return deliveryDate >= startDate && deliveryDate <= endDate;
    });
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
          
          {/* Hidden logo for PDF generation */}
          <div className="hidden">
            <Logo className="company-logo" />
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
