
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
import { FileText, Edit, FileDown, FileUp, Trash2, CreditCard } from 'lucide-react';
import { useFinancial } from '@/contexts/financial';
import { useClients } from '@/contexts';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';
import { FinancialReport } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { getCompanyInfo, createPDFReport, createExcelReport } from '@/utils/printUtils';
import { CloseReportDialog } from '@/components/financial/CloseReportDialog';
import { EditPaymentDetailsDialog } from '@/components/financial/EditPaymentDetailsDialog';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ReceivableAccount } from '@/types/financial';

const FinancialPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("open");
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [reportToClose, setReportToClose] = useState<FinancialReport | null>(null);
  const [reportToEdit, setReportToEdit] = useState<FinancialReport | null>(null);
  
  // Get financial data safely with fallbacks
  const { 
    financialReports = [], 
    loading: isLoading = false, 
    closeReport, 
    reopenReport, 
    deleteFinancialReport,
    updatePaymentDetails 
  } = useFinancial();
  
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
  
  const handleCloseReportWithDetails = async (reportId: string, paymentMethod: string, dueDate: string) => {
    try {
      // Primeiro atualiza os dados adicionais do relatório
      await closeReport(reportId, paymentMethod, dueDate);
      
      // Depois cria a conta a receber automaticamente
      const report = financialReports.find(r => r.id === reportId);
      const client = report ? clients.find(c => c.id === report.clientId) : null;
      
      if (report && client) {
        // Criar dados para a conta a receber
        await createReceivableAccount({
          clientId: report.clientId,
          clientName: client.name,
          description: `Relatório ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
          amount: report.totalFreight,
          dueDate: dueDate,
          status: 'pending',
          categoryId: 'fretes', // Categoria de fretes
          categoryName: 'Fretes',
          reportId: report.id,
          paymentMethod: paymentMethod,
          notes: `Referente ao relatório de ${client.name} no período de ${format(new Date(report.startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(report.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
        });
      }
    } catch (error) {
      console.error("Erro ao fechar relatório:", error);
    }
  };

  // Função para criar uma conta a receber na base de dados
  const createReceivableAccount = async (data: {
    clientId: string;
    clientName: string;
    description: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'received' | 'overdue' | 'partially_received';
    categoryId: string;
    categoryName: string;
    reportId: string;
    paymentMethod: string;
    notes?: string;
  }) => {
    try {
      const now = new Date().toISOString();
      const newAccountData = {
        client_id: data.clientId,
        client_name: data.clientName,
        description: data.description,
        amount: data.amount,
        due_date: data.dueDate,
        status: data.status,
        category_id: data.categoryId,
        category_name: data.categoryName,
        report_id: data.reportId,
        payment_method: data.paymentMethod,
        notes: data.notes,
        created_at: now,
        updated_at: now
      };
      
      // Inserir no Supabase
      const { data: insertedData, error } = await supabase
        .from('receivable_accounts')
        .insert(newAccountData)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Conta a receber criada",
        description: `Uma conta a receber foi criada automaticamente para ${data.clientName}.`,
      });
      
      return insertedData;
    } catch (error) {
      console.error("Erro ao criar conta a receber:", error);
      toast({
        title: "Erro ao criar conta a receber",
        description: "Ocorreu um erro ao criar a conta a receber.",
        variant: "destructive"
      });
    }
  };

  // Função para editar as informações de pagamento
  const handleEditPaymentDetails = async (reportId: string, paymentMethod: string | null, dueDate: string | null) => {
    try {
      await updatePaymentDetails(reportId, paymentMethod, dueDate);
      
      // Também atualiza a conta a receber correspondente, se existir
      const report = financialReports.find(r => r.id === reportId);
      
      if (report) {
        const updateData: any = {};
        if (paymentMethod !== null) updateData.payment_method = paymentMethod;
        if (dueDate !== null) updateData.due_date = dueDate;
        
        // Atualiza a conta a receber no Supabase
        const { error } = await supabase
          .from('receivable_accounts')
          .update(updateData)
          .eq('report_id', reportId);
        
        if (error) {
          console.error("Erro ao atualizar conta a receber:", error);
        } else {
          toast({
            title: "Conta a receber atualizada",
            description: "Os detalhes de pagamento da conta a receber foram atualizados.",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar detalhes de pagamento:", error);
    }
  };

  const handleReopenReport = async (reportId: string) => {
    try {
      await reopenReport(reportId);
      
      // Marca a conta a receber como cancelada ou exclui
      const { error } = await supabase
        .from('receivable_accounts')
        .delete()
        .eq('report_id', reportId);
      
      if (error) {
        console.error("Erro ao excluir conta a receber:", error);
      } else {
        toast({
          title: "Conta a receber excluída",
          description: "A conta a receber relacionada a este relatório foi excluída.",
        });
      }
    } catch (error) {
      console.error("Erro ao reabrir relatório:", error);
    }
  };

  const handleViewReport = (reportId: string) => {
    // Navigate to reports page with the specific report ID
    navigate(`/reports?reportId=${reportId}`);
  };
  
  const handleExportPDF = (report: FinancialReport) => {
    const client = clients.find(c => c.id === report.clientId);
    
    // Get filtered deliveries for this report
    const filteredDeliveries = deliveriesForReport(report);
    
    createPDFReport({
      report,
      client,
      deliveries: filteredDeliveries,
      companyData,
      formatCurrency
    });
  };
  
  const handleExportExcel = (report: FinancialReport) => {
    const client = clients.find(c => c.id === report.clientId);
    const filteredDeliveries = deliveriesForReport(report);
    
    createExcelReport({
      report,
      client,
      deliveries: filteredDeliveries,
      companyData,
      formatCurrency
    });
  };
  
  const handleDeleteReport = async () => {
    if (reportToDelete) {
      try {
        // Excluir a conta a receber relacionada ao relatório
        const { error } = await supabase
          .from('receivable_accounts')
          .delete()
          .eq('report_id', reportToDelete);
        
        if (error) {
          console.error("Erro ao excluir conta a receber:", error);
        }
        
        // Depois exclui o relatório
        await deleteFinancialReport(reportToDelete);
        setReportToDelete(null);
      } catch (error) {
        console.error("Erro ao excluir relatório:", error);
      }
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
  
  // Formatar método de pagamento para exibição
  const getPaymentMethodLabel = (method?: string) => {
    if (!method) return "N/A";
    
    const methods = {
      boleto: "Boleto",
      pix: "PIX",
      cartao: "Cartão",
      especie: "Espécie",
      transferencia: "Transferência"
    };
    
    return methods[method as keyof typeof methods] || method;
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
                              <ScrollArea className="max-w-[300px] whitespace-nowrap">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setReportToClose(report)}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Fechar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewReport(report.id)}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Ver
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setReportToDelete(report.id)}
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
            </TabsContent>
            
            <TabsContent value="closed" className="space-y-4">
              <div className="rounded-md border overflow-x-auto">
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
                    ) : closedReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
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
                            <TableCell>{getPaymentMethodLabel(report.paymentMethod)}</TableCell>
                            <TableCell>
                              {report.dueDate 
                                ? format(new Date(report.dueDate), 'dd/MM/yyyy', { locale: ptBR }) 
                                : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(report.totalFreight)}</TableCell>
                            <TableCell className="text-right">
                              <ScrollArea className="max-w-[300px] whitespace-nowrap">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setReportToEdit(report)}
                                  >
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    Editar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleReopenReport(report.id)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Reabrir
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewReport(report.id)}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Ver
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleExportPDF(report)}
                                  >
                                    <FileDown className="h-4 w-4 mr-1" />
                                    PDF
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleExportExcel(report)}
                                  >
                                    <FileUp className="h-4 w-4 mr-1" />
                                    Excel
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setReportToDelete(report.id)}
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
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
      
      {/* Diálogo para fechar relatório com informações de pagamento */}
      {reportToClose && (
        <CloseReportDialog
          report={reportToClose}
          open={Boolean(reportToClose)}
          onOpenChange={(open) => !open && setReportToClose(null)}
          onClose={handleCloseReportWithDetails}
        />
      )}
      
      {/* Diálogo para editar detalhes de pagamento */}
      {reportToEdit && (
        <EditPaymentDetailsDialog
          report={reportToEdit}
          open={Boolean(reportToEdit)}
          onOpenChange={(open) => !open && setReportToEdit(null)}
          onSave={handleEditPaymentDetails}
        />
      )}
      
      {/* Diálogo de confirmação de exclusão */}
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
