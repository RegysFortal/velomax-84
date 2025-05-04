
import { createContext, useContext, ReactNode } from 'react';
import { FinancialContextType } from './types';
import { useFinancialOperations } from './useFinancialOperations';
import { useFetchFinancialReports } from './useFetchFinancialReports';
import { useReportStatus } from './useReportStatus';
import { useFinancialStorage } from './useFinancialStorage';
import { useAuth } from '@/contexts/auth/AuthContext';

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
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
