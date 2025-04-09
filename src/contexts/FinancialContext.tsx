
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FinancialReport } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

type FinancialContextType = {
  financialReports: FinancialReport[];
  addFinancialReport: (report: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => Promise<void>;
  deleteFinancialReport: (id: string) => Promise<void>;
  getFinancialReport: (id: string) => FinancialReport | undefined;
  getReportsByStatus: (status: FinancialReport['status']) => FinancialReport[];
  closeReport: (id: string) => Promise<void>;
  loading: boolean;
};

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchFinancialReports = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('financial_reports')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Map Supabase data to match our FinancialReport type
        const mappedReports = data.map((report: any): FinancialReport => ({
          id: report.id,
          clientId: report.client_id,
          startDate: report.start_date,
          endDate: report.end_date,
          totalDeliveries: report.total_deliveries,
          totalFreight: report.total_freight,
          status: report.status as FinancialReport['status'],
          createdAt: report.created_at || new Date().toISOString(),
          updatedAt: report.updated_at || new Date().toISOString(),
        }));
        
        setFinancialReports(mappedReports);
      } catch (error) {
        console.error('Error fetching financial reports:', error);
        toast({
          title: "Erro ao carregar relatórios financeiros",
          description: "Usando dados locais como fallback.",
          variant: "destructive"
        });
        
        // Load from localStorage as fallback
        const storedReports = localStorage.getItem('velomax_financial_reports');
        if (storedReports) {
          try {
            setFinancialReports(JSON.parse(storedReports));
          } catch (error) {
            console.error('Failed to parse stored reports', error);
            setFinancialReports([]);
          }
        } else {
          setFinancialReports([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchFinancialReports();
    }
  }, [toast, user]);
  
  // Save financial reports to localStorage as a backup
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_financial_reports', JSON.stringify(financialReports));
    }
  }, [financialReports, loading]);
  
  const addFinancialReport = async (
    report: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    try {
      const timestamp = new Date().toISOString();
      
      const existingReport = financialReports.find(
        (r) => 
          r.clientId === report.clientId && 
          r.status === 'open' &&
          new Date(r.startDate).getTime() <= new Date(report.endDate).getTime() &&
          new Date(r.endDate).getTime() >= new Date(report.startDate).getTime()
      );
      
      if (existingReport) {
        toast({
          title: "Relatório já existe",
          description: `Já existe um relatório aberto para este cliente no período selecionado.`,
          variant: "destructive"
        });
        return existingReport.id;
      }
      
      // Prepare data for Supabase insert
      const supabaseReport = {
        client_id: report.clientId,
        start_date: report.startDate,
        end_date: report.endDate,
        total_deliveries: report.totalDeliveries,
        total_freight: report.totalFreight,
        status: report.status,
        user_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('financial_reports')
        .insert(supabaseReport)
        .select();
      
      if (error) {
        throw error;
      }
      
      // Map the returned data to our FinancialReport type
      const newReport: FinancialReport = {
        id: data[0].id,
        clientId: data[0].client_id,
        startDate: data[0].start_date,
        endDate: data[0].end_date,
        totalDeliveries: data[0].total_deliveries,
        totalFreight: data[0].total_freight,
        status: data[0].status as FinancialReport['status'],
        createdAt: data[0].created_at || timestamp,
        updatedAt: data[0].updated_at || timestamp,
      };
      
      setFinancialReports((prev) => [...prev, newReport]);
      
      toast({
        title: "Relatório financeiro criado",
        description: `O relatório financeiro foi criado com sucesso.`,
      });
      
      return newReport.id;
    } catch (error) {
      console.error("Error adding financial report:", error);
      toast({
        title: "Erro ao criar relatório financeiro",
        description: "Ocorreu um erro ao criar o relatório financeiro. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const updateFinancialReport = async (id: string, report: Partial<FinancialReport>) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Prepare data for Supabase update
      const supabaseReport: any = {
        updated_at: timestamp
      };
      
      // Map properties from report to supabaseReport
      if (report.clientId !== undefined) supabaseReport.client_id = report.clientId;
      if (report.startDate !== undefined) supabaseReport.start_date = report.startDate;
      if (report.endDate !== undefined) supabaseReport.end_date = report.endDate;
      if (report.totalDeliveries !== undefined) supabaseReport.total_deliveries = report.totalDeliveries;
      if (report.totalFreight !== undefined) supabaseReport.total_freight = report.totalFreight;
      if (report.status !== undefined) supabaseReport.status = report.status;

      const { error } = await supabase
        .from('financial_reports')
        .update(supabaseReport)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setFinancialReports((prev) => 
        prev.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              ...report,
              updatedAt: timestamp
            };
          }
          return r;
        })
      );
      
      toast({
        title: "Relatório financeiro atualizado",
        description: `O relatório financeiro foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error("Error updating financial report:", error);
      toast({
        title: "Erro ao atualizar relatório financeiro",
        description: "Ocorreu um erro ao atualizar o relatório financeiro. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const deleteFinancialReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_reports')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setFinancialReports((prev) => prev.filter((report) => report.id !== id));
      
      toast({
        title: "Relatório financeiro removido",
        description: `O relatório financeiro foi removido com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting financial report:", error);
      toast({
        title: "Erro ao remover relatório financeiro",
        description: "Ocorreu um erro ao remover o relatório financeiro. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const getFinancialReport = (id: string) => {
    return financialReports.find((report) => report.id === id);
  };
  
  const getReportsByStatus = (status: FinancialReport['status']) => {
    return financialReports.filter((report) => report.status === status);
  };
  
  const closeReport = async (id: string) => {
    console.log(`Fechando relatório com ID: ${id}`);
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
    
    await updateFinancialReport(id, { status: 'closed' });
    
    console.log("Relatórios após fechamento:", 
      financialReports.map(r => ({id: r.id, status: r.status}))
    );
    
    toast({
      title: "Relatório fechado",
      description: `O relatório financeiro foi fechado com sucesso.`,
    });
  };
  
  return (
    <FinancialContext.Provider value={{
      financialReports,
      addFinancialReport,
      updateFinancialReport,
      deleteFinancialReport,
      getFinancialReport,
      getReportsByStatus,
      closeReport,
      loading,
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
