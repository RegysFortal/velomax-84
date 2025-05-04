
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const useReportStatus = (
  financialReports: FinancialReport[],
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => Promise<void>
) => {
  const { toast } = useToast();

  const getFinancialReport = (id: string) => {
    return financialReports.find((report) => report.id === id);
  };
  
  const getReportsByStatus = (status: FinancialReport['status']) => {
    return financialReports.filter((report) => report.status === status);
  };

  const closeReport = async (id: string, paymentMethod?: string, dueDate?: string) => {
    console.log(`Fechando relatório com ID: ${id}, método: ${paymentMethod}, vencimento: ${dueDate}`);
    const reportToClose = financialReports.find(report => report.id === id);
    
    if (!reportToClose) {
      console.error(`Relatório com ID ${id} não encontrado.`);
      toast({
        title: "Erro ao fechar relatório",
        description: "Relatório não encontrado.",
        variant: "destructive"
      });
      return;
    }
    
    const updateData: Partial<FinancialReport> = {
      status: 'closed',
      paymentMethod,
      dueDate
    };
    
    await updateFinancialReport(id, updateData);
    
    // Automatically create a receivable account entry when there's payment info
    if (paymentMethod || dueDate) {
      await createReceivableAccount(reportToClose, paymentMethod, dueDate);
    }
    
    console.log("Relatórios após fechamento:", 
      financialReports.map(r => ({id: r.id, status: r.status}))
    );
    
    toast({
      title: "Relatório fechado",
      description: `O relatório financeiro foi fechado com sucesso.`,
    });
  };

  const reopenReport = async (id: string) => {
    console.log(`Reabrindo relatório com ID: ${id}`);
    const reportToReopen = financialReports.find(report => report.id === id);
    
    if (!reportToReopen) {
      console.error(`Relatório com ID ${id} não encontrado.`);
      toast({
        title: "Erro ao reabrir relatório",
        description: "Relatório não encontrado.",
        variant: "destructive"
      });
      return;
    }
    
    await updateFinancialReport(id, { status: 'open' });
    
    console.log("Relatórios após reabertura:", 
      financialReports.map(r => ({id: r.id, status: r.status}))
    );
    
    toast({
      title: "Relatório reaberto",
      description: `O relatório financeiro foi reaberto com sucesso.`,
    });
  };
  
  const updatePaymentDetails = async (id: string, paymentMethod: string | null, dueDate: string | null) => {
    console.log(`Atualizando detalhes de pagamento do relatório com ID: ${id}`);
    const reportToUpdate = financialReports.find(report => report.id === id);
    
    if (!reportToUpdate) {
      console.error(`Relatório com ID ${id} não encontrado.`);
      toast({
        title: "Erro ao atualizar detalhes",
        description: "Relatório não encontrado.",
        variant: "destructive"
      });
      return;
    }
    
    const updateData: Partial<FinancialReport> = {};
    
    // Only include properties that are being updated
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    
    await updateFinancialReport(id, updateData);
    
    // Update related receivable account or create if it doesn't exist
    await updateOrCreateReceivableAccount(reportToUpdate, paymentMethod, dueDate);
    
    toast({
      title: "Detalhes atualizados",
      description: `Os detalhes de pagamento foram atualizados com sucesso.`,
    });
  };
  
  // Helper function to create a receivable account based on a report
  const createReceivableAccount = async (
    report: FinancialReport, 
    paymentMethod?: string, 
    dueDate?: string
  ) => {
    try {
      console.log("Criando conta a receber para relatório:", report.id);
      
      // Get client info
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('name')
        .eq('id', report.clientId)
        .single();
      
      if (clientError) {
        console.error("Erro ao buscar informações do cliente:", clientError);
        return;
      }
      
      const clientName = clientData?.name || "Cliente não encontrado";
      const reportPeriod = `${report.startDate} a ${report.endDate}`;
      
      // Check if a receivable account for this report already exists using direct SQL query
      const { data: existingAccount, error: searchError } = await supabase
        .rpc('check_receivable_account_exists', { report_id: report.id });
      
      if (searchError) {
        console.error("Erro ao verificar conta existente:", searchError);
        return;
      }
      
      // If account already exists, update it
      if (existingAccount && existingAccount.exists) {
        console.log("Conta a receber já existe, atualizando via RPC");
        const { error: updateError } = await supabase
          .rpc('update_receivable_account', {
            p_report_id: report.id,
            p_payment_method: paymentMethod || null,
            p_due_date: dueDate || null
          });
        
        if (updateError) {
          console.error("Erro ao atualizar conta a receber:", updateError);
        }
        return;
      }
      
      // Create new receivable account via RPC function
      const { error: insertError } = await supabase
        .rpc('create_receivable_account', {
          p_id: uuidv4(),
          p_client_id: report.clientId,
          p_client_name: clientName,
          p_description: `Relatório de ${reportPeriod}`,
          p_amount: report.totalFreight,
          p_due_date: dueDate || null,
          p_payment_method: paymentMethod || null,
          p_notes: `Referente ao relatório financeiro do período ${reportPeriod}`,
          p_report_id: report.id
        });
      
      if (insertError) {
        console.error("Erro ao criar conta a receber:", insertError);
        return;
      }
      
      toast({
        title: "Conta a receber criada",
        description: `Uma conta a receber foi criada automaticamente para o relatório.`,
      });
      
    } catch (error) {
      console.error("Erro ao criar conta a receber:", error);
    }
  };
  
  // Function to update an existing receivable account or create a new one
  const updateOrCreateReceivableAccount = async (
    report: FinancialReport, 
    paymentMethod: string | null, 
    dueDate: string | null
  ) => {
    try {
      console.log("Atualizando/Criando conta a receber para relatório:", report.id);
      
      // Check if a receivable account for this report already exists using RPC
      const { data: existingAccount, error: searchError } = await supabase
        .rpc('check_receivable_account_exists', { report_id: report.id });
      
      if (searchError) {
        console.error("Erro ao verificar conta existente:", searchError);
        return;
      }
      
      // If account already exists, update it
      if (existingAccount && existingAccount.exists) {
        console.log("Conta a receber já existe, atualizando via RPC");
        
        const { error: updateError } = await supabase
          .rpc('update_receivable_account', {
            p_report_id: report.id,
            p_payment_method: paymentMethod,
            p_due_date: dueDate
          });
        
        if (updateError) {
          console.error("Erro ao atualizar conta a receber:", updateError);
        } else {
          toast({
            title: "Conta a receber atualizada",
            description: `Os detalhes de pagamento foram atualizados na conta a receber.`,
          });
        }
        return;
      }
      
      // If the account doesn't exist and we have payment info, create a new one
      if (paymentMethod !== null || dueDate !== null) {
        await createReceivableAccount(report, paymentMethod || undefined, dueDate || undefined);
      }
      
    } catch (error) {
      console.error("Erro ao atualizar/criar conta a receber:", error);
    }
  };

  return {
    getFinancialReport,
    getReportsByStatus,
    closeReport,
    reopenReport,
    updatePaymentDetails
  };
};
