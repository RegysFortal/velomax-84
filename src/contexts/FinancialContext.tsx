
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FinancialReport } from '@/types';
import { useToast } from '@/components/ui/use-toast';

type FinancialContextType = {
  financialReports: FinancialReport[];
  addFinancialReport: (report: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => void;
  deleteFinancialReport: (id: string) => void;
  getFinancialReport: (id: string) => FinancialReport | undefined;
  getReportsByStatus: (status: FinancialReport['status']) => FinancialReport[];
  closeReport: (id: string) => void;
  loading: boolean;
};

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load financial reports from localStorage or use empty array
    const loadReports = () => {
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
      setLoading(false);
    };
    
    loadReports();
  }, []);
  
  // Save financial reports to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_financial_reports', JSON.stringify(financialReports));
    }
  }, [financialReports, loading]);
  
  const addFinancialReport = (
    report: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>
  ): string => {
    const timestamp = new Date().toISOString();
    const newId = `report-${Date.now()}`;
    
    // Check if an open report already exists for the same client and date range
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
    
    const newReport: FinancialReport = {
      ...report,
      id: newId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setFinancialReports((prev) => [...prev, newReport]);
    toast({
      title: "Relatório financeiro criado",
      description: `O relatório financeiro foi criado com sucesso.`,
    });
    
    return newId;
  };
  
  const updateFinancialReport = (id: string, report: Partial<FinancialReport>) => {
    setFinancialReports((prev) => 
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            ...report,
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    
    toast({
      title: "Relatório financeiro atualizado",
      description: `O relatório financeiro foi atualizado com sucesso.`,
    });
  };
  
  const deleteFinancialReport = (id: string) => {
    setFinancialReports((prev) => prev.filter((report) => report.id !== id));
    toast({
      title: "Relatório financeiro removido",
      description: `O relatório financeiro foi removido com sucesso.`,
    });
  };
  
  const getFinancialReport = (id: string) => {
    return financialReports.find((report) => report.id === id);
  };
  
  const getReportsByStatus = (status: FinancialReport['status']) => {
    return financialReports.filter((report) => report.status === status);
  };
  
  const closeReport = (id: string) => {
    setFinancialReports((prev) => 
      prev.map((report) => {
        if (report.id === id) {
          return {
            ...report,
            status: 'closed' as const,
            updatedAt: new Date().toISOString()
          };
        }
        return report;
      })
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
