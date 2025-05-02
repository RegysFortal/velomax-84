
import { useState } from 'react';
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

export const useFinancialOperations = () => {
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

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
  
  const createReport = async (
    report: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<FinancialReport | null> => {
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
        return existingReport;
      }
      
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
      
      return newReport;
    } catch (error) {
      console.error("Error creating financial report:", error);
      toast({
        title: "Erro ao criar relatório financeiro",
        description: "Ocorreu um erro ao criar o relatório financeiro. Tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const updateFinancialReport = async (id: string, report: Partial<FinancialReport>) => {
    try {
      const timestamp = new Date().toISOString();
      
      const supabaseReport: any = {
        updated_at: timestamp
      };
      
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

  return {
    financialReports,
    setFinancialReports,
    loading,
    setLoading,
    addFinancialReport,
    createReport,
    updateFinancialReport,
    deleteFinancialReport,
  };
};
