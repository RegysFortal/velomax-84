
import { useState } from 'react';
import { FinancialReport } from '@/types';
import { useFinancialReportCreate } from './hooks/useFinancialReportCreate';
import { useFinancialReportUpdate } from './hooks/useFinancialReportUpdate';
import { useFinancialReportDelete } from './hooks/useFinancialReportDelete';
import { useReceivableAccounts } from '@/hooks/financial/useReceivableAccounts';

export const useFinancialOperations = () => {
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(true);
  
  const receivableAccountsHook = useReceivableAccounts();
  
  const { addFinancialReport, createReport } = useFinancialReportCreate(
    financialReports, 
    setFinancialReports
  );
  
  const { updateFinancialReport } = useFinancialReportUpdate(
    financialReports, 
    setFinancialReports
  );
  
  const { deleteFinancialReport } = useFinancialReportDelete(
    financialReports, 
    setFinancialReports
  );

  return {
    financialReports,
    setFinancialReports,
    loading,
    setLoading,
    addFinancialReport,
    createReport,
    updateFinancialReport,
    deleteFinancialReport,
    receivableAccountsHook,
  };
};
