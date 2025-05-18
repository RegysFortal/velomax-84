
import { createContext, useContext, ReactNode } from 'react';
import { FinancialContextType } from './types';
// Import from the stub file directly in the same directory
import { useFinancialOperations } from './useFinancialOperations';
import { useFetchFinancialReports } from './useFetchFinancialReports';
import { useReportStatus } from './useReportStatus';
import { useFinancialStorage } from './useFinancialStorage';
import { useAuth } from '@/contexts/auth/AuthContext';

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  const { supabaseUser: user } = useAuth();
  
  const {
    financialReports,
    setFinancialReports,
    loading,
    setLoading,
    addFinancialReport,
    createReport,
    updateFinancialReport,
    deleteFinancialReport
  } = useFinancialOperations();

  useFetchFinancialReports(user, setFinancialReports, setLoading);
  useFinancialStorage(financialReports, loading);
  
  const {
    getFinancialReport,
    getReportsByStatus,
    closeReport,
    reopenReport,
    archiveReport,
    updatePaymentDetails
  } = useReportStatus(financialReports, updateFinancialReport);
  
  return (
    <FinancialContext.Provider value={{
      financialReports,
      addFinancialReport,
      updateFinancialReport,
      deleteFinancialReport,
      getFinancialReport,
      getReportsByStatus,
      closeReport,
      reopenReport,
      archiveReport,
      createReport,
      updatePaymentDetails,
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
