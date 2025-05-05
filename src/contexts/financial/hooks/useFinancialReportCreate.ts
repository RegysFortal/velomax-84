
import { useState } from 'react';
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

export const useFinancialReportCreate = (
  financialReports: FinancialReport[],
  setFinancialReports: React.Dispatch<React.SetStateAction<FinancialReport[]>>
) => {
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

  return {
    addFinancialReport,
    createReport
  };
};
